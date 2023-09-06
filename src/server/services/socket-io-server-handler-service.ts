import {
    updateHiddenFiles,
    updateMediaFiles,
    updateThumbnailFileList,
} from '../../shared/actions/media-actions'
import {
    setCuedFileName,
    setGenerics,
    setLoop,
    setManualStart,
    setMix,
    setOperationMode,
    setSelectedFileName,
    setWeb,
} from '../../shared/actions/settings-action'
import {
    HiddenFileInfo,
    HiddenFiles,
    MediaFile,
    Output,
} from '../../shared/models/media-models'
import {
    GenericSettings,
    OperationMode,
    OutputSettings,
} from '../../shared/models/settings-models'
import { ReduxMediaService } from '../../shared/services/redux-media-service'
import { ReduxSettingsService } from '../../shared/services/redux-settings-service'
import {
    ClientToServerCommand,
    GET_SETTINGS,
    ServerToClientCommand,
    TimeSelectedFilePayload,
} from '../../shared/socket-io-constants'
import { reduxStore, state } from '../../shared/store'
import { logger } from '../utils/logger'
import { CasparCgHandlerService } from './casparcg-handler-service'
import { HiddenFilesPersistenceService } from './hidden-files-persistence-service'
import { SettingsPersistenceService } from './settings-persistence-service'
import { CasparCgPlayoutService } from './casparcg-playout-service'
import { CasparCG } from 'casparcg-connection'

/*
    A new instance of this should not be created at new usage sites.
    Instead, the instance created and saved in ExpressService should be used.
    ExpressService is a singleton, and therefor saves and uses the same instance for the full runtime.
    Not following this, could cause duplicate, unnecessary, events to be fired.
    This will very likely be fixed during UT-203.
*/
export class SocketIOServerHandlerService {
    private reduxMediaService: ReduxMediaService
    private reduxSettingsService: ReduxSettingsService
    private casparCgHandlerService: CasparCgHandlerService
    private hiddenFilesPersistenceService: HiddenFilesPersistenceService
    private settingsPersistenceService: SettingsPersistenceService
    private readonly casparCgPlayoutService: CasparCgPlayoutService
    private readonly socketServer

    constructor(socketServer: any, casparCgConnection: CasparCG) {
        this.socketServer = socketServer
        this.reduxMediaService = new ReduxMediaService()
        this.reduxSettingsService = new ReduxSettingsService()
        this.casparCgHandlerService = CasparCgHandlerService.instance
        this.hiddenFilesPersistenceService = new HiddenFilesPersistenceService(
            socketServer
        )
        this.settingsPersistenceService = new SettingsPersistenceService()
        this.casparCgPlayoutService = new CasparCgPlayoutService(
            casparCgConnection
        )
    }

    public setupSocketEvents(socket: any): void {
        logger.info('SETTING UP SOCKET IO MAIN HANDLERS')

        this.socketServer.emit(
            ServerToClientCommand.SETTINGS_UPDATE,
            state.settings
        )
        this.initializeClient()

        socket
            .on(GET_SETTINGS, () => {
                this.socketServer.emit(
                    ServerToClientCommand.SETTINGS_UPDATE,
                    state.settings
                )
            })
            .on(
                ClientToServerCommand.TOGGLE_THUMBNAIL_VISIBILITY,
                (channelIndex: number, fileName: string) =>
                    this.processToggleThumbnailVisibilityEvent(
                        channelIndex,
                        fileName
                    )
            )
            .on(
                ClientToServerCommand.PGM_PLAY,
                (channelIndex: number, fileName: string) =>
                    this.processPlayEvent(channelIndex, fileName)
            )
            .on(
                ClientToServerCommand.PGM_LOAD,
                (channelIndex: number, fileName: string) =>
                    this.processLoadEvent(channelIndex, fileName)
            )
            .on(
                ClientToServerCommand.SET_LOOP_STATE,
                (channelIndex: number, loopState: boolean) =>
                    this.processSetLoopStateEvent(channelIndex, loopState)
            )
            .on(
                ClientToServerCommand.SET_OPERATION_MODE,
                (channelIndex: number, mode: OperationMode) =>
                    this.processSetOperationModeEvent(channelIndex, mode)
            )
            .on(
                ClientToServerCommand.SET_MANUAL_START_STATE,
                (channelIndex: number, manualStartState: boolean) =>
                    this.processSetManualStartStateEvent(
                        channelIndex,
                        manualStartState
                    )
            )
            .on(
                ClientToServerCommand.SET_MIX_STATE,
                (channelIndex: number, mixState: boolean) =>
                    this.processSetMixStateEvent(channelIndex, mixState)
            )
            .on(
                ClientToServerCommand.SET_WEB_STATE,
                (channelIndex: number, webState: boolean) =>
                    this.processSetWebStateEvent(channelIndex, webState)
            )
            .on(
                ClientToServerCommand.SET_GENERICS,
                (generics: GenericSettings) =>
                    this.processSetGenericsEvent(generics)
            )
            .on(ClientToServerCommand.RESTART_SERVER, () => {
                process.exit(0)
            })
    }

    private processSetGenericsEvent(generics: GenericSettings) {
        logger.data(generics).trace('Save Settings')
        logger.info('Updating and storing generic settings server side.')
        const oldAllOutputSettings: OutputSettings[] =
            state.settings.generics.outputSettings
        reduxStore.dispatch(setGenerics(generics))
        state.settings.generics.outputSettings.forEach(
            (outputSettings, channelIndex) => {
                if (
                    this.shouldUpdatePlayingOverlay(
                        oldAllOutputSettings[channelIndex],
                        outputSettings
                    )
                ) {
                    this.updateOverlayPlayingState(channelIndex, outputSettings)
                }
            }
        )
        this.settingsPersistenceService.save()
        this.socketServer.emit(
            ServerToClientCommand.SETTINGS_UPDATE,
            state.settings
        )
        this.cleanUpMediaFiles()
    }

    private processSetMixStateEvent(channelIndex: number, mixState: boolean) {
        reduxStore.dispatch(setMix(channelIndex, mixState))
        this.settingsPersistenceService.save()
        this.socketServer.emit(
            ServerToClientCommand.MIX_STATE_UPDATE,
            channelIndex,
            this.reduxSettingsService.getOutputSettings(
                state.settings,
                channelIndex
            ).mixState
        )
    }

    private processSetManualStartStateEvent(
        channelIndex: number,
        manualStartState: boolean
    ) {
        reduxStore.dispatch(setManualStart(channelIndex, manualStartState))
        this.settingsPersistenceService.save()
        this.socketServer.emit(
            ServerToClientCommand.MANUAL_START_STATE_UPDATE,
            channelIndex,
            this.reduxSettingsService.getOutputSettings(
                state.settings,
                channelIndex
            ).manualStartState
        )
    }

    private processSetOperationModeEvent(
        channelIndex: number,
        mode: OperationMode
    ) {
        reduxStore.dispatch(setOperationMode(channelIndex, mode))
        this.settingsPersistenceService.save()
        this.socketServer.emit(
            ServerToClientCommand.OPERATION_MODE_UPDATE,
            channelIndex,
            this.reduxSettingsService.getOutputSettings(
                state.settings,
                channelIndex
            ).operationMode
        )
    }

    private processToggleThumbnailVisibilityEvent(
        channelIndex: number,
        fileName: string
    ) {
        const isFilePlaying: boolean = this.reduxSettingsService
            .getGenericSettings(state.settings)
            .outputSettings.some(
                (output) => output.selectedFileName === fileName
            )
        if (isFilePlaying) {
            return
        }

        const hiddenFiles: HiddenFiles = state.media.hiddenFiles
        try {
            const updatedHiddenFiles: HiddenFiles = this.toggleHiddenFile(
                fileName,
                channelIndex,
                hiddenFiles
            )
            reduxStore.dispatch(updateHiddenFiles(updatedHiddenFiles))
            this.hiddenFilesPersistenceService.save(updatedHiddenFiles)
            this.socketServer.emit(
                ServerToClientCommand.HIDDEN_FILES_UPDATE,
                updatedHiddenFiles
            )
        } catch (error) {
            logger
                .data(error)
                .error('Error thrown during "TOGGLE_THUMBNAIL_VISIBILITY"')
        }
    }

    private processSetWebStateEvent(
        channelIndex: number,
        webState: boolean
    ): void {
        reduxStore.dispatch(setWeb(channelIndex, webState))
        this.settingsPersistenceService.save()
        this.socketServer.emit(
            ServerToClientCommand.WEB_STATE_UPDATE,
            channelIndex,
            this.reduxSettingsService.getOutputSettings(
                state.settings,
                channelIndex
            ).webState
        )
        const outputSettings: OutputSettings =
            this.reduxSettingsService.getOutputSettings(
                state.settings,
                channelIndex
            )
        this.updateOverlayPlayingState(channelIndex, outputSettings)
    }

    private processSetLoopStateEvent(
        channelIndex: number,
        loopState: boolean
    ): void {
        reduxStore.dispatch(setLoop(channelIndex, loopState))
        this.settingsPersistenceService.save()
        this.socketServer.emit(
            ServerToClientCommand.LOOP_STATE_UPDATE,
            channelIndex,
            this.reduxSettingsService.getOutputSettings(
                state.settings,
                channelIndex
            ).loopState
        )
    }

    private processPlayEvent(channelIndex: number, fileName: string): void {
        const mixState = this.reduxSettingsService.getOutputSettings(
            state.settings,
            channelIndex
        ).mixState
        const action = !mixState
            ? this.casparCgPlayoutService.playMedia.bind(
                  this.casparCgPlayoutService
              )
            : this.casparCgPlayoutService.mixMedia.bind(
                  this.casparCgPlayoutService
              )
        action(channelIndex, 9, fileName)
            .then(() => {
                logger.info(
                    `Playing ${fileName} on channel index ${channelIndex}.`
                )
                this.updateCuedFile(channelIndex, '')
                this.updateSelectedFile(channelIndex, fileName)
                this.settingsPersistenceService.save()
            })
            .catch((reason) => {
                this.notifyAboutError(
                    `Failed to play file: ${fileName}`,
                    reason as Error
                )
            })
    }

    public notifyAboutError(message: string, error: Error): void {
        logger.data(error).error(message)
        this.socketServer.emit('error', `${message}|${error.message}`)
    }

    private processLoadEvent(channelIndex: number, fileName: string): void {
        this.casparCgPlayoutService
            .loadMedia(channelIndex, 9, fileName)
            .then(() => {
                logger.info(
                    `Loading ${fileName} on channel index ${channelIndex}.`
                )
                this.updateCuedFile(channelIndex, fileName)
                this.updateSelectedFile(channelIndex, '')
                this.settingsPersistenceService.save()
            })
            .catch((reason) => {
                this.notifyAboutError(
                    `Failed to play file: ${fileName}`,
                    reason as Error
                )
            })
    }

    private updateCuedFile(channelIndex: number, fileName: string): void {
        reduxStore.dispatch(setCuedFileName(channelIndex, fileName))
        this.socketServer.emit(
            ServerToClientCommand.FILE_CUED_UPDATE,
            channelIndex,
            fileName
        )
    }

    private updateSelectedFile(channelIndex: number, fileName: string): void {
        reduxStore.dispatch(setSelectedFileName(channelIndex, fileName))
        this.socketServer.emit(
            ServerToClientCommand.FILE_SELECTED_UPDATE,
            channelIndex,
            fileName
        )
    }

    private shouldUpdatePlayingOverlay(
        oldOutputSettings: OutputSettings,
        newOutputSettings: OutputSettings
    ): boolean {
        return (
            oldOutputSettings.webState !== newOutputSettings.webState ||
            oldOutputSettings.webUrl !== newOutputSettings.webUrl
        )
    }

    private updateOverlayPlayingState(
        channelIndex: number,
        outputSettings: OutputSettings
    ): void {
        if (outputSettings.webState) {
            if (outputSettings.webUrl === '') {
                return
            }
            const webUrl = outputSettings.webUrl
            this.casparCgPlayoutService
                .playOverlay(channelIndex, 10, webUrl)
                .then(() => {
                    logger.info(
                        `Overlay playing ${webUrl} on channel index ${channelIndex}.`
                    )
                })
        } else {
            this.casparCgPlayoutService
                .stopOverlay(channelIndex, 10)
                .then(() => {
                    logger.info(
                        `Stopped playing overlay for channel: ${channelIndex}`
                    )
                })
        }
    }

    private toggleHiddenFile(
        fileName: string,
        channelIndex: number,
        hiddenFiles: HiddenFiles
    ): HiddenFiles {
        return this.isFileHidden(fileName, hiddenFiles)
            ? this.showFile(fileName, hiddenFiles)
            : this.hideFile(fileName, channelIndex, hiddenFiles)
    }

    private isFileHidden(fileName: string, hiddenFiles: HiddenFiles): boolean {
        return fileName in hiddenFiles
    }

    private showFile(
        fileName: string,
        hiddenFilesOrig: HiddenFiles
    ): HiddenFiles {
        const newHiddenFiles = { ...hiddenFilesOrig }
        delete newHiddenFiles[fileName]
        return newHiddenFiles
    }

    private hideFile(
        fileName: string,
        channelIndex: number,
        hiddenFiles: HiddenFiles
    ): HiddenFiles {
        const hiddenFileInfo: HiddenFileInfo =
            this.buildHiddenFileMetadataFromFileName(fileName, channelIndex)
        return { ...hiddenFiles, [fileName]: hiddenFileInfo }
    }

    private buildHiddenFileMetadataFromFileName(
        fileName: string,
        channelIndex: number
    ): HiddenFileInfo {
        const file = this.findFile(fileName, channelIndex)
        if (!file) {
            throw new Error(`No such file: ${fileName}`)
        }
        return this.getMetadata(file)
    }

    private findFile(
        fileName: string,
        channelIndex: number
    ): MediaFile | undefined {
        return this.reduxMediaService
            .getOutput(state.media, channelIndex)
            .mediaFiles.find(
                (file) => file.name.toUpperCase() === fileName.toUpperCase()
            )
    }

    private getMetadata(file: MediaFile): HiddenFileInfo {
        return {
            changed: file.changed,
            size: file.size,
        }
    }

    private cleanUpMediaFiles(): void {
        this.reduxMediaService
            .getOutputs(state.media)
            .forEach(({}, channelIndex: number) => {
                reduxStore.dispatch(updateMediaFiles(channelIndex, []))
                reduxStore.dispatch(updateThumbnailFileList(channelIndex, []))
                this.casparCgHandlerService.assignThumbnailsToOutputs(
                    this.socketServer
                )
            })
    }

    initializeClient(): void {
        const selectedFiles: string[] = []
        const outputSettings = new ReduxSettingsService().getGenericSettings(
            state.settings
        ).outputSettings
        outputSettings.forEach(
            (output: OutputSettings, channelIndex: number) => {
                selectedFiles.push(
                    this.initializeChannelOutputSettings(output, channelIndex)
                )
            }
        )
        this.initializeOutputMedia(selectedFiles)
    }

    private initializeChannelOutputSettings(
        output: OutputSettings,
        channelIndex: number
    ): string {
        this.socketServer.emit(
            ServerToClientCommand.LOOP_STATE_UPDATE,
            channelIndex,
            output.loopState
        )
        this.socketServer.emit(
            ServerToClientCommand.OPERATION_MODE_UPDATE,
            channelIndex,
            output.operationMode
        )
        this.socketServer.emit(
            ServerToClientCommand.MIX_STATE_UPDATE,
            channelIndex,
            output.mixState
        )
        this.socketServer.emit(
            ServerToClientCommand.MANUAL_START_STATE_UPDATE,
            channelIndex,
            output.manualStartState
        )
        this.socketServer.emit(
            ServerToClientCommand.HIDDEN_FILES_UPDATE,
            state.media.hiddenFiles
        )
        return output.selectedFileName
    }

    private initializeOutputMedia(selectedFiles: string[]) {
        const timeTallyData: TimeSelectedFilePayload[] = []
        const outputMedia: Output[] = this.reduxMediaService.getOutputs(
            state.media
        )
        outputMedia.forEach((output, channelIndex) => {
            timeTallyData[channelIndex] = {
                time: output.time,
                selectedFileName: selectedFiles[channelIndex],
            }
            this.socketServer.emit(
                ServerToClientCommand.TIME_TALLY_UPDATE,
                timeTallyData
            )
            this.socketServer.emit(
                ServerToClientCommand.THUMBNAIL_UPDATE,
                channelIndex,
                output.thumbnailList
            )
            this.socketServer.emit(
                ServerToClientCommand.MEDIA_UPDATE,
                channelIndex,
                output.mediaFiles
            )
        })
        this.socketServer.emit(
            ServerToClientCommand.TIME_TALLY_UPDATE,
            timeTallyData
        )
    }
}
