import { CasparCG } from 'casparcg-connection'
import { state } from '../../shared/store'
import * as Path from 'path'

export interface ChannelInfo {
    foreground?: Foreground
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
        const defaultLayer = state.settings.generics.ccgSettings.defaultLayer
        const channelInfo: ChannelInfo =
            infoResponse.response.data?.stage?.layer[
                String('layer_' + defaultLayer)
            ]
        if (channelInfo.foreground) {
            channelInfo.foreground.file.path = this.getMediaFolderAdjustedName(
                channelInfo.foreground.file.path
            )
        }
        return channelInfo
    }

    public async isChannelBlank(index: number): Promise<boolean> {
        const info: ChannelInfo = await this.getChannelInfo(index)
        return !info.foreground
    }

    private getMediaFolderAdjustedName(rawPath: string): string {
        const mediaPath = this.casparCgMediaPath.replace(/\\/g, '/')
        const rawPathConverted = rawPath.replace('//', '/')

        return Path.relative(mediaPath, rawPathConverted)
    }
}
