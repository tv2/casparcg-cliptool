import { logger } from '../utils/logger'
import { reduxStore, state } from '../../shared/store'
import {
    updateFolders,
    updateHiddenFiles,
    updateMediaFiles,
} from '../../shared/actions/media-actions'
import {
    isDeepCompareEqual,
    isFolderNameEqual,
} from '../utils/ccg-handler-utils'
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
} from '../../shared/socket-io-constants'
import {
    HiddenFileInfo,
    HiddenFiles,
    MediaFile,
    Output,
} from '../../shared/models/media-models'
import {
    GenericSettings,
    OutputSettings,
} from '../../shared/models/settings-models'
import { setGenerics } from '../../shared/actions/settings-action'
import { SettingsPersistenceService } from './settings-persistence-service'
import { CasparCG } from 'casparcg-connection'
import { HiddenFilesPersistenceService } from './hidden-files-persistence-service'
import { ReduxMediaService } from '../../shared/services/redux-media-service'
import { ReduxSettingsService } from '../../shared/services/redux-settings-service'
import { AmcpThumbnailsService } from './amcp-thumbnails-service'
import { Server as SocketServer } from 'socket.io'

export class AmcpMediaService {
    private readonly casparCgConnection: CasparCG
    private readonly socketServer: SocketServer<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        any
    >
    private readonly hiddenFilesPersistenceService: HiddenFilesPersistenceService
    private readonly reduxMediaService: ReduxMediaService
    private readonly reduxSettingsService: ReduxSettingsService
    private readonly amcpThumbnailService: AmcpThumbnailsService

    constructor(
        casparCgConnection: CasparCG,
        socketServer: SocketServer<
            ClientToServerEvents,
            ServerToClientEvents,
            InterServerEvents,
            any
        >,
        amcpThumbnailsService: AmcpThumbnailsService
    ) {
        this.casparCgConnection = casparCgConnection
        this.socketServer = socketServer
        this.reduxMediaService = new ReduxMediaService()
        this.reduxSettingsService = new ReduxSettingsService()
        this.hiddenFilesPersistenceService = new HiddenFilesPersistenceService(
            this.socketServer,
            this.reduxSettingsService
        )
        this.amcpThumbnailService = amcpThumbnailsService
    }

    public async getFileChanges(): Promise<void> {
        logger.trace('Polling for File Changes.')
        await this.loadFileList()
    }

    private async loadFileList(): Promise<void> {
        try {
            const mediaFiles: MediaFile[] = (
                await this.casparCgConnection.cls()
            ).response.data
            if (mediaFiles.length === 0) {
                logger.warn(
                    'Received no files from CasparCG when requesting them. Is the media folder empty or the path misconfigured?'
                )
            }
            reduxStore.dispatch(
                updateFolders(this.extractFoldersList(mediaFiles))
            )
            this.socketServer.emit('folderUpdate', state.media.folders)

            this.extractFilesToOutputs(mediaFiles)
            await this.fixInvalidUsedPathsInSettings(mediaFiles)
            this.checkHiddenFilesChanged(mediaFiles)
        } catch (error) {
            logger
                .data(error)
                .warn(
                    'Caught failed attempt to retrieve file list from CasparCG, with the reason:'
                )
        }
    }

    private extractFoldersList(fileList: MediaFile[]): string[] {
        let folders: string[] = fileList.map((media: MediaFile) =>
            media.name.substring(0, media.name.lastIndexOf('/'))
        )
        return [...new Set(folders)]
    }

    private extractFilesToOutputs(allFiles: MediaFile[]): void {
        const outputs: Output[] = this.reduxMediaService.getOutputs(state.media)
        if (outputs.length !== state.settings.ccgConfig.channels.length) {
            logger.warn(
                `Expected ${state.settings.ccgConfig.channels.length} Outputs but had ${outputs.length}`
            )
        }
        outputs.forEach((output: Output, outputIndex: number) =>
            this.extractFilesToOutput(allFiles, outputIndex, output)
        )
    }

    private extractFilesToOutput(
        allFiles: MediaFile[],
        outputIndex: number,
        output: Output
    ): void {
        const outputFolder: string =
            this.reduxSettingsService.getOutputSettingsFolder(
                state.settings,
                outputIndex
            )
        const outputMediaFiles: MediaFile[] = this.getOutputMediaFiles(
            allFiles,
            outputFolder
        )
        if (isDeepCompareEqual(output.mediaFiles, outputMediaFiles)) {
            return
        }

        logger.info(`Media files changed for output: ${outputIndex}`)
        reduxStore.dispatch(updateMediaFiles(outputIndex, outputMediaFiles))
        this.socketServer.emit('mediaUpdate', outputIndex, outputMediaFiles)
    }

    private getOutputMediaFiles(
        allFiles: MediaFile[],
        folder: string
    ): MediaFile[] {
        return allFiles.filter(
            (file) =>
                isFolderNameEqual(file.name, folder) &&
                !this.isAlphaFile(file.name)
        )
    }

    private isAlphaFile(filename: string): boolean {
        return /_a(\.[^.]+)?$/i.test(filename)
    }

    private async fixInvalidUsedPathsInSettings(
        allFiles: MediaFile[]
    ): Promise<void> {
        const outputSettingsWithFixedPaths: OutputSettings[] =
            this.reduxSettingsService
                .getAllOutputSettings(state.settings)
                .map((outputSettings) =>
                    this.reduxSettingsService.clearInvalidTargetedPaths(
                        allFiles,
                        outputSettings,
                        state.media
                    )
                )
        if (
            !isDeepCompareEqual(
                this.reduxSettingsService.getAllOutputSettings(state.settings),
                outputSettingsWithFixedPaths
            )
        ) {
            await this.saveFixedPathsSettings(outputSettingsWithFixedPaths)
        }
    }

    private async saveFixedPathsSettings(
        outputSettingsWithFixedPaths: OutputSettings[]
    ): Promise<void> {
        logger.warn(
            'Removing some invalid paths from settings, that likely exist due to folders/files being deleted while off.'
        )
        const genericSettings: GenericSettings = { ...state.settings.generics }
        genericSettings.outputSettings = outputSettingsWithFixedPaths
        reduxStore.dispatch(setGenerics(genericSettings))
        this.amcpThumbnailService.assignThumbnailsToOutputs()
        await SettingsPersistenceService.instance.save()
    }

    private checkHiddenFilesChanged(files: MediaFile[]): void {
        let needsUpdating: boolean = false
        const hiddenFiles: HiddenFiles = { ...state.media.hiddenFiles }
        for (const key in hiddenFiles) {
            const hiddenFileInfo: HiddenFileInfo = hiddenFiles[key]
            const file: MediaFile | undefined = files.find(
                (predicate) => predicate.name == key
            )
            if (
                !file ||
                file.changed !== hiddenFileInfo.changed ||
                file.size !== hiddenFileInfo.size
            ) {
                delete hiddenFiles[key]
                needsUpdating = true
            }
        }
        if (!needsUpdating) {
            return
        }

        logger
            .data(hiddenFiles)
            .debug('Hidden files were updated from external changes:')
        reduxStore.dispatch(updateHiddenFiles(hiddenFiles))
        this.socketServer.emit('hiddenFilesUpdate', hiddenFiles)
        this.hiddenFilesPersistenceService.save(hiddenFiles)
    }
}
