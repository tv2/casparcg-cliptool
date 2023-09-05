import { ThumbnailFile } from '../../shared/models/media-models'
import { reduxStore, state } from '../../shared/store'
import {
    isDeepCompareEqual,
    isFolderNameEqual,
} from '../utils/ccg-handler-utils'
import { updateThumbnailFileList } from '../../shared/actions/media-actions'
import { ServerToClientCommand } from '../../shared/socket-io-constants'
import { ReduxMediaService } from '../../shared/services/redux-media-service'
import { ReduxSettingsService } from '../../shared/services/redux-settings-service'
import { logger } from '../utils/logger'
import { CasparCG } from 'casparcg-connection'

export class AmcpThumbnailsService {
    public static readonly instance = new AmcpThumbnailsService()
    private thumbnails: ThumbnailFile[]
    private previousThumbnails: ThumbnailFile[]
    private reduxMediaService: ReduxMediaService
    private readonly reduxSettingsService: ReduxSettingsService
    private casparCgConnection!: CasparCG
    private socketServer: any

    private constructor() {
        this.reduxMediaService = new ReduxMediaService()
        this.reduxSettingsService = new ReduxSettingsService()
        this.thumbnails = []
        this.previousThumbnails = []
    }

    public setupAmcpThumbnailService(casparCg: CasparCG, socketServer: any) {
        this.casparCgConnection = casparCg
        this.socketServer = socketServer
    }

    public updateStoredThumbnails(newThumbnails: ThumbnailFile[]): void {
        this.thumbnails = newThumbnails
    }
    public getStoredThumbnails(): ThumbnailFile[] {
        return this.thumbnails
    }
    public updateStoredPreviousThumbnails(
        newThumbnails: ThumbnailFile[]
    ): void {
        this.previousThumbnails = newThumbnails
    }
    public getStoredPreviousThumbnails(): ThumbnailFile[] {
        return this.previousThumbnails
    }

    public assignThumbnailsToOutputs(socketServer: any): void {
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

    public async getThumbnailChanges(): Promise<void> {
        logger.trace('Polling for Thumbnail Changes.')
        const retrievedThumbnails: ThumbnailFile[] | undefined =
            await this.getThumbnailFiles()
        if (
            !retrievedThumbnails ||
            !this.hasThumbnailListChanged(
                retrievedThumbnails,
                this.previousThumbnails
            )
        ) {
            return
        }

        this.updateStoredPreviousThumbnails(this.thumbnails)
        const newThumbnails: ThumbnailFile[] = await this.loadThumbnails(
            retrievedThumbnails
        )
        this.updateStoredThumbnails(newThumbnails)
        this.assignThumbnailsToOutputs(this.socketServer)
    }

    private hasThumbnailListChanged(
        newList: ThumbnailFile[],
        previousList: ThumbnailFile[]
    ): boolean {
        if (newList.length !== previousList.length) {
            return true
        }
        return newList.some(
            (file, index) =>
                file.name !== previousList[index].name ||
                file.size !== previousList[index].size
        )
    }

    private async getThumbnailFiles(): Promise<ThumbnailFile[] | undefined> {
        try {
            const thumbnailResponse =
                await this.casparCgConnection.thumbnailList()
            return thumbnailResponse.response.data
        } catch (error) {
            logger
                .data(error)
                .warn(
                    'Caught failed attempt to retrieve thumbnails from CasparCG, with the reason:'
                )
            return undefined
        }
    }

    private async loadThumbnails(
        retrievedThumbnails: ThumbnailFile[]
    ): Promise<ThumbnailFile[]> {
        return await Promise.all(
            retrievedThumbnails.map(
                async (retrieved) => await this.loadThumbnailImage(retrieved)
            )
        )
    }

    private async loadThumbnailImage(
        element: ThumbnailFile
    ): Promise<ThumbnailFile> {
        const thumbnail = await this.casparCgConnection.thumbnailRetrieve(
            element.name
        )
        return {
            name: element.name,
            changed: element.changed,
            size: element.size,
            type: element.type,
            thumbnail: thumbnail.response.data,
        }
    }
}
