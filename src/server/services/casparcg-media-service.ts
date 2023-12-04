import { ReduxSettingsService } from '../../shared/services/redux-settings-service'
import { state } from '../../shared/store'
import { MediaFile } from '../../shared/models/media-models'
import { GenericSettings } from '../../shared/models/settings-models'
import { CasparCgHandlerService } from './casparcg-handler-service'
import * as Path from 'path'
import axios, { AxiosResponse } from 'axios'
import { logger } from '../utils/logger'

interface RawMediaFile {
    name: string
    path: string
    size: number
    time: number
    field_order: string
    streams: Stream[]
    format: Format
    mediaSize: number
    mediaTime: number
}

interface Stream {
    codec: Codec
    width?: number
    height?: number
    sample_aspect_ratio?: string
    display_aspect_ratio?: string
    pix_fmt?: string
    bits_per_raw_sample?: string
    time_base: string
    start_time?: string
    duration_ts?: number
    duration?: string
    bit_rate?: string
    nb_frames?: string
    sample_fmt?: string
    sample_rate?: string
    channels?: number
    channel_layout?: string
    bits_per_sample?: number
    max_bit_rate?: string
}

interface Codec {
    long_name?: string
    type: string
    time_base?: string
    tag_string: string
    is_avc?: string
}

interface Format {
    name: string
    long_name: string
    start_time?: string
    duration?: string
    bit_rate?: string
}

const PORT: number = 8000

export class CasparCgMediaService {
    private reduxSettingsService: ReduxSettingsService
    private casparCgMediaPath!: string

    public constructor() {
        this.reduxSettingsService = new ReduxSettingsService()
        this.getCasparCgMediaPath().then(
            (path) => (this.casparCgMediaPath = path)
        )
    }

    private async getCasparCgMediaPath(): Promise<string> {
        try {
            let response = await CasparCgHandlerService.instance
                .getCasparCgConnection()
                .infoPaths()
            return `${response.getParam('media-path')}`
        } catch (reason) {
            throw new Error(
                `Failed to retrieve needed media path from CasparCg: ${(
                    reason as Error
                ).toString()}`
            )
        }
    }

    public async getMediaFiles(): Promise<MediaFile[]> {
        const rawMedia: RawMediaFile[] = await this.getRawMedia()
        logger.debug(`Retrieved ${rawMedia.length} files.`)
        return rawMedia.map((rawMediaFile: RawMediaFile) => {
            switch (rawMediaFile.streams.length) {
                case 1:
                    return this.mapRawImageMediaFile(rawMediaFile)
                case 2:
                case 3:
                    return this.mapRawVideoMediaFile(rawMediaFile)
                default: {
                    throw new Error(
                        `Unexpected amount of streams on received file: ${rawMediaFile.path}`
                    )
                }
            }
        })
    }

    private mapRawImageMediaFile(rawFile: RawMediaFile): MediaFile {
        return {
            ...this.extractCommonAttribute(rawFile),
            type: 'image',
            frames: 0,
            frameTime: '0/1',
            frameRate: 0,
            duration: 0,
        }
    }

    private mapRawVideoMediaFile(rawFile: RawMediaFile): MediaFile {
        const duration: string | undefined = rawFile.format.duration
        this.assertValueExists(rawFile, !duration, 'duration')
        const convertedDuration: number = +duration!

        const frames: number = this.getFrames(rawFile)

        const frameTime: string | undefined = rawFile.streams[0].time_base
        this.assertValueExists(rawFile, !frameTime, 'frameTime')

        const frameRate: number = frames / convertedDuration
        return {
            ...this.extractCommonAttribute(rawFile),
            type: 'video',
            duration: convertedDuration,
            frames: frames,
            frameTime: frameTime!,
            frameRate: frameRate,
        }
    }

    private getFrames(rawFile: RawMediaFile): number {
        try {
            const frames: string | undefined = rawFile.streams[0].nb_frames
            this.assertValueExists(rawFile, !frames, 'frames')
            return +frames!
        } catch (error) {
            throw error
        }
    }

    private assertValueExists(
        rawFile: RawMediaFile,
        assertedCondition: boolean,
        fieldName: string
    ): void {
        if (assertedCondition) {
            throw new Error(
                `Expected a value for '${fieldName}' on file: ${this.getMediaFolderAdjustedName(
                    rawFile.path
                )}`
            )
        }
    }

    private extractCommonAttribute(rawFile: RawMediaFile) {
        return {
            name: this.getMediaFolderAdjustedName(rawFile.path),
            changed: rawFile.time,
            size: rawFile.size,
            extension: this.getFileExtension(rawFile.path),
        }
    }

    private getMediaFolderAdjustedName(rawPath: string): string {
        return Path.relative(this.casparCgMediaPath, rawPath)
    }

    private getFileExtension(rawPath: string): string {
        return Path.extname(rawPath)
    }

    private async getRawMedia(): Promise<RawMediaFile[]> {
        const response: AxiosResponse = await axios.get(
            this.getRequestAddress()
        )
        return response.data as RawMediaFile[]
    }

    private getRequestAddress(): string {
        const genericSettings: GenericSettings =
            this.reduxSettingsService.getGenericSettings(state.settings)
        const ip: string =
            genericSettings.ccgSettings.ip === '0.0.0.0'
                ? '127.0.0.1'
                : genericSettings.ccgSettings.ip

        return `http://${ip}:${PORT}/media`
    }
}
