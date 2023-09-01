import { CasparCG } from 'casparcg-connection'
import { updateThumbnailFileList } from '../../shared/actions/media-actions'
import { ThumbnailFile } from '../../shared/models/media-models'
import { ReduxMediaService } from '../../shared/services/redux-media-service'
import { ReduxSettingsService } from '../../shared/services/redux-settings-service'
import { ServerToClientCommand } from '../../shared/socket-io-constants'
import { reduxStore, state } from '../../shared/store'
import {
    isDeepCompareEqual,
    isFolderNameEqual,
} from '../utils/ccg-handler-utils'

export class CasparCgHandlerService {
    public static readonly instance = new CasparCgHandlerService()
    private reduxMediaService: ReduxMediaService
    private reduxSettingsService: ReduxSettingsService
    private thumbnails: ThumbnailFile[]
    private previousThumbnails: ThumbnailFile[]
    private readonly casparCgConnection: CasparCG

    constructor() {
        this.reduxMediaService = new ReduxMediaService()
        this.reduxSettingsService = new ReduxSettingsService()
        this.thumbnails = []
        this.previousThumbnails = []

        //Setup AMCP Connection:
        this.casparCgConnection = new CasparCG({
            host: this.reduxSettingsService.getGenericSettings(state.settings)
                .ccgSettings.ip,
            port: this.reduxSettingsService.getGenericSettings(state.settings)
                .ccgSettings.amcpPort,
            autoConnect: true,
        })
    }
    getCasparCgConnection(): CasparCG {
        return this.casparCgConnection
    }

    updateStoredThumbnails(newThumbnails: ThumbnailFile[]): void {
        this.thumbnails = newThumbnails
    }
    getStoredThumbnails(): ThumbnailFile[] {
        return this.thumbnails
    }
    updateStoredPreviousThumbnails(newThumbnails: ThumbnailFile[]): void {
        this.previousThumbnails = newThumbnails
    }
    getStoredPreviousThumbnails(): ThumbnailFile[] {
        return this.previousThumbnails
    }

    assignThumbnailsToOutputs(socketServer: any): void {
        this.reduxMediaService
            .getOutputs(state.media)
            .forEach(({}, channelIndex: number) => {
                const outputMedia = this.thumbnails.filter(
                    (thumbnail: ThumbnailFile) => {
                        return isFolderNameEqual(
                            thumbnail?.name,
                            this.reduxSettingsService.getOutputSettings(
                                state.settings,
                                channelIndex
                            ).folder
                        )
                    }
                )
                const outputThumbnailList = this.reduxMediaService.getOutput(
                    state.media,
                    channelIndex
                ).thumbnailList
                if (!isDeepCompareEqual(outputThumbnailList, outputMedia)) {
                    reduxStore.dispatch(
                        updateThumbnailFileList(channelIndex, outputMedia)
                    )
                    socketServer.emit(
                        ServerToClientCommand.THUMBNAIL_UPDATE,
                        channelIndex,
                        outputMedia
                    )
                }
            })
    }
}
