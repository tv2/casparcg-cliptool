import { CasparCG } from 'casparcg-connection'
import * as Path from 'path'
import { logger } from '../utils/logger'

export interface ChannelInfo {
    stage?: Stage
}

export interface Stage {
    layer: Layer
}

export interface Layer {
    layer_10: Layer10
}

export interface Layer10 {
    foreground: Foreground
}

export interface Foreground {
    file: File
    paused: boolean
    producer: string
}

export interface File {
    path: string
}

export class CasparCgInfoService {
    private readonly casparCgConnection: CasparCG
    private casparCgMediaPath!: string
    constructor(casparCgConnection: CasparCG) {
        this.casparCgConnection = casparCgConnection
        this.getCasparCgMediaPath().then(
            (path) => (this.casparCgMediaPath = path)
        )
    }

    private async getCasparCgMediaPath(): Promise<string> {
        try {
            const response = await this.casparCgConnection.infoPaths()
            return response.response.data.media
        } catch (reason) {
            throw new Error(
                `Failed to retrieve needed media path from CasparCg: ${(
                    reason as Error
                ).toString()}`
            )
        }
    }

    public async getChannelInfo(index: number): Promise<ChannelInfo> {
        const infoResponse = await this.casparCgConnection.info(index + 1)
        const convertedInfo: ChannelInfo = infoResponse.response.data
        logger.data(convertedInfo).trace(index)
        if (convertedInfo.stage) {
            convertedInfo.stage.layer.layer_10.foreground.file.path =
                this.getMediaFolderAdjustedName(
                    convertedInfo.stage.layer.layer_10.foreground.file.path
                )
        }

        return convertedInfo
    }

    private getMediaFolderAdjustedName(rawPath: string): string {
        return Path.relative(this.casparCgMediaPath, rawPath).replace(
            /\\/g,
            '/'
        )
    }
}
