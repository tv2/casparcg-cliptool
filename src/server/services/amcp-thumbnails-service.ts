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
    private readonly reduxMediaService: ReduxMediaService
    private readonly reduxSettingsService: ReduxSettingsService
    private thumbnails: ThumbnailFile[]
    private previousThumbnails: ThumbnailFile[]
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

    public updateStoredPreviousThumbnails(
        newThumbnails: ThumbnailFile[]
    ): void {
        this.previousThumbnails = newThumbnails
    }

    public assignThumbnailsToOutputs(): void {
        this.reduxMediaService
            .getOutputs(state.media)
            .forEach(({}, channelIndex: number) =>
                this.assignThumbnailsToOutput(channelIndex)
            )
    }

    private assignThumbnailsToOutput(index: number): void {
        const folderThumbnailFiles: ThumbnailFile[] =
            this.getFolderFilteredThumbnails(
                this.reduxSettingsService.getOutputSettingsFolder(
                    state.settings,
                    index
                )
            )
        const outputThumbnailFiles: ThumbnailFile[] =
            this.getOutputThumbnailFiles(index)

        if (isDeepCompareEqual(outputThumbnailFiles, folderThumbnailFiles)) {
            return
        }

        reduxStore.dispatch(
            updateThumbnailFileList(index, folderThumbnailFiles)
        )
        this.socketServer.emit(
            ServerToClientCommand.THUMBNAIL_UPDATE,
            index,
            folderThumbnailFiles
        )
    }

    private getFolderFilteredThumbnails(folder: string): ThumbnailFile[] {
        return this.thumbnails.filter((thumbnail: ThumbnailFile) => {
            return isFolderNameEqual(thumbnail.name, folder)
        })
    }

    private getOutputThumbnailFiles(index: number): ThumbnailFile[] {
        return this.reduxMediaService.getOutput(state.media, index)
            .thumbnailList
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
        this.assignThumbnailsToOutputs()
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

    private loadThumbnails(
        retrievedThumbnails: ThumbnailFile[]
    ): Promise<ThumbnailFile[]> {
        return Promise.all(
            retrievedThumbnails.map((retrieved) =>
                this.loadThumbnailImage(retrieved)
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
