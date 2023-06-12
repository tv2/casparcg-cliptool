import { state, reduxStore } from '../../shared/store'
import { logger } from '../utils/logger'

import { socketServer } from './express-handler'
import {
    mixMedia,
    playMedia,
    loadMedia,
    playOverlay,
    stopOverlay,
} from '../utils/ccg-load-play'
import {
    updateMediaFiles,
    updateThumbnailFileList,
    updateHiddenFiles,
} from '../../shared/actions/media-actions'
import {
    setGenerics,
    setCuedFileName,
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
} from '../../shared/models/media-models'
import { assignThumbnailsToOutputs } from './caspar-cg-handler'
import settingsService from '../../shared/services/settings-service'
import mediaService from '../../shared/services/media-service'
import {
    GenericSettings,
    OperationMode,
    OutputSettings,
} from '../../shared/models/settings-models'
import settingsPersistenceService from '../services/settings-persistence-service'
import hiddenFilesPersistenceService from '../services/hidden-files-persistence-service'
import {
    ClientToServerCommand,
    GET_SETTINGS,
    ServerToClientCommand,
    TimeSelectedFilePayload,
} from '../../shared/socket-io-constants'

export function socketIoHandlers(socket: any): void {
    logger.info('SETTING UP SOCKET IO MAIN HANDLERS')

    socketServer.emit(ServerToClientCommand.SETTINGS_UPDATE, state.settings)
    initializeClient()

    socket
        .on(GET_SETTINGS, () => {
            socketServer.emit(
                ServerToClientCommand.SETTINGS_UPDATE,
                state.settings
            )
        })
        .on(
            ClientToServerCommand.TOGGLE_THUMBNAIL_VISIBILITY,
            (channelIndex: number, fileName: string) => {
                if (
                    settingsService
                        .getGenericSettings(state.settings)
                        .outputSettings.some(
                            (output) => output.selectedFileName === fileName
                        )
                ) {
                    return
                }

                const hiddenFiles = state.media.hiddenFiles
                try {
                    const updatedHiddenFiles = toggleHiddenFile(
                        fileName,
                        channelIndex,
                        hiddenFiles
                    )
                    reduxStore.dispatch(updateHiddenFiles(updatedHiddenFiles))
                    hiddenFilesPersistenceService.save(updatedHiddenFiles)

                    socketServer.emit(
                        ServerToClientCommand.HIDDEN_FILES_UPDATE,
                        updatedHiddenFiles
                    )
                } catch (error) {
                    logger
                        .data(error)
                        .error(
                            'Error thrown during "TOGGLE_THUMBNAIL_VISIBILITY"'
                        )
                }
            }
        )
        .on(
            ClientToServerCommand.PGM_PLAY,
            (channelIndex: number, fileName: string) => {
                if (
                    !settingsService.getOutputSettings(
                        state.settings,
                        channelIndex
                    ).mixState
                ) {
                    playMedia(channelIndex, 9, fileName)
                } else {
                    mixMedia(channelIndex, 9, fileName)
                }
                logger.info(
                    `Playing ${fileName} on channel index ${channelIndex}.`
                )
                reduxStore.dispatch(setCuedFileName(channelIndex, ''))
                socketServer.emit(
                    ServerToClientCommand.FILE_CUED_UPDATE,
                    channelIndex,
                    ''
                )
                reduxStore.dispatch(setSelectedFileName(channelIndex, fileName))
                settingsPersistenceService.save()
                socketServer.emit(
                    ServerToClientCommand.FILE_SELECTED_UPDATE,
                    channelIndex,
                    fileName
                )
            }
        )
        .on(
            ClientToServerCommand.PGM_LOAD,
            (channelIndex: number, fileName: string) => {
                loadMedia(channelIndex, 9, fileName)
                reduxStore.dispatch(setCuedFileName(channelIndex, fileName))
                socketServer.emit(
                    ServerToClientCommand.FILE_CUED_UPDATE,
                    channelIndex,
                    fileName
                )
                reduxStore.dispatch(setSelectedFileName(channelIndex, ''))
                socketServer.emit(
                    ServerToClientCommand.FILE_SELECTED_UPDATE,
                    channelIndex,
                    ''
                )
                settingsPersistenceService.save()
                logger.info(
                    `Loading ${fileName} on channel index ${channelIndex}.`
                )
            }
        )
        .on(
            ClientToServerCommand.SET_LOOP_STATE,
            (channelIndex: number, loopState: boolean) => {
                reduxStore.dispatch(setLoop(channelIndex, loopState))
                settingsPersistenceService.save()
                socketServer.emit(
                    ServerToClientCommand.LOOP_STATE_UPDATE,
                    channelIndex,
                    settingsService.getOutputSettings(
                        state.settings,
                        channelIndex
                    ).loopState
                )
            }
        )
        .on(
            ClientToServerCommand.SET_OPERATION_MODE,
            (channelIndex: number, mode: OperationMode) => {
                reduxStore.dispatch(setOperationMode(channelIndex, mode))
                socketServer.emit(
                    ServerToClientCommand.OPERATION_MODE_UPDATE,
                    channelIndex,
                    settingsService.getOutputSettings(
                        state.settings,
                        channelIndex
                    ).operationMode
                )
            }
        )
        .on(
            ClientToServerCommand.SET_MANUAL_START_STATE,
            (channelIndex: number, manualStartState: boolean) => {
                reduxStore.dispatch(
                    setManualStart(channelIndex, manualStartState)
                )
                settingsPersistenceService.save()
                socketServer.emit(
                    ServerToClientCommand.MANUAL_START_STATE_UPDATE,
                    channelIndex,
                    settingsService.getOutputSettings(
                        state.settings,
                        channelIndex
                    ).manualStartState
                )
            }
        )
        .on(
            ClientToServerCommand.SET_MIX_STATE,
            (channelIndex: number, mixState: boolean) => {
                reduxStore.dispatch(setMix(channelIndex, mixState))
                settingsPersistenceService.save()
                socketServer.emit(
                    ServerToClientCommand.MIX_STATE_UPDATE,
                    channelIndex,
                    settingsService.getOutputSettings(
                        state.settings,
                        channelIndex
                    ).mixState
                )
            }
        )
        .on(
            ClientToServerCommand.SET_WEB_STATE,
            (channelIndex: number, webState: boolean) => {
                reduxStore.dispatch(setWeb(channelIndex, webState))
                settingsPersistenceService.save()
                socketServer.emit(
                    ServerToClientCommand.WEB_STATE_UPDATE,
                    channelIndex,
                    settingsService.getOutputSettings(
                        state.settings,
                        channelIndex
                    ).webState
                )
                const outputSettings = settingsService.getOutputSettings(
                    state.settings,
                    channelIndex
                )
                updateOverlayPlayingState(channelIndex, outputSettings)
            }
        )
        .on(ClientToServerCommand.SET_GENERICS, (generics: GenericSettings) => {
            logger.data(generics).trace('Save Settings')
            state.settings.generics.outputSettings.forEach(
                (outputSettings, channelIndex) => {
                    const currentChangedOutputSetitngs =
                        generics.outputSettings[channelIndex]
                    if (
                        outputSettings.webState !==
                            currentChangedOutputSetitngs.webState ||
                        outputSettings.webUrl !==
                            currentChangedOutputSetitngs.webUrl
                    ) {
                        updateOverlayPlayingState(channelIndex, outputSettings)
                    }
                }
            )
            logger.info('Updating and storing generic settings server side.')
            reduxStore.dispatch(setGenerics(generics))
            settingsPersistenceService.save()
            socketServer.emit(
                ServerToClientCommand.SETTINGS_UPDATE,
                state.settings
            )
            cleanUpMediaFiles()
        })
        .on(ClientToServerCommand.RESTART_SERVER, () => {
            process.exit(0)
        })
}

function updateOverlayPlayingState(
    channelIndex: number,
    outputSettings: OutputSettings
): void {
    if (outputSettings.webState) {
        const webUrl = outputSettings.webUrl
        playOverlay(channelIndex, 10, webUrl)
        logger.info(
            `Overlay playing ${webUrl} on channel index ${channelIndex}.`
        )
    } else {
        stopOverlay(channelIndex, 10)
    }
}

function toggleHiddenFile(
    fileName: string,
    channelIndex: number,
    hiddenFiles: HiddenFiles
): HiddenFiles {
    return isFileHidden(fileName, hiddenFiles)
        ? showFile(fileName, hiddenFiles)
        : hideFile(fileName, channelIndex, hiddenFiles)
}

function isFileHidden(fileName: string, hiddenFiles: HiddenFiles): boolean {
    return fileName in hiddenFiles
}

function showFile(fileName: string, hiddenFilesOrig: HiddenFiles): HiddenFiles {
    const newHiddenFiles = { ...hiddenFilesOrig }
    delete newHiddenFiles[fileName]
    return newHiddenFiles
}

function hideFile(
    fileName: string,
    channelIndex: number,
    hiddenFiles: HiddenFiles
): HiddenFiles {
    const hiddenFileInfo: HiddenFileInfo = buildHiddenFileMetadataFromFileName(
        fileName,
        channelIndex
    )
    return { ...hiddenFiles, [fileName]: hiddenFileInfo }
}

function buildHiddenFileMetadataFromFileName(
    fileName: string,
    channelIndex: number
): HiddenFileInfo {
    const file = findFile(fileName, channelIndex)
    if (!file) {
        throw new Error(`No such file: ${fileName}`)
    }
    return getMetadata(file)
}

function findFile(
    fileName: string,
    channelIndex: number
): MediaFile | undefined {
    return mediaService
        .getOutput(state.media, channelIndex)
        .mediaFiles.find(
            (file) => file.name.toUpperCase() === fileName.toUpperCase()
        )
}

function getMetadata(file: MediaFile): HiddenFileInfo {
    return {
        changed: file.changed,
        size: file.size,
    }
}

export function initializeClient(): void {
    let timeTallyData: TimeSelectedFilePayload[] = []
    const selectedFiles: string[] = []
    settingsService
        .getGenericSettings(state.settings)
        .outputSettings.forEach(
            (output: OutputSettings, channelIndex: number) => {
                selectedFiles.push(output.selectedFileName)
                socketServer.emit(
                    ServerToClientCommand.LOOP_STATE_UPDATE,
                    channelIndex,
                    output.loopState
                )
                socketServer.emit(
                    ServerToClientCommand.OPERATION_MODE_UPDATE,
                    channelIndex,
                    output.operationMode
                )
                socketServer.emit(
                    ServerToClientCommand.MIX_STATE_UPDATE,
                    channelIndex,
                    output.mixState
                )
                socketServer.emit(
                    ServerToClientCommand.MANUAL_START_STATE_UPDATE,
                    channelIndex,
                    output.manualStartState
                )
                socketServer.emit(
                    ServerToClientCommand.HIDDEN_FILES_UPDATE,
                    state.media.hiddenFiles
                )
            }
        )
    mediaService.getOutputs(state.media).forEach((output, channelIndex) => {
        timeTallyData[channelIndex] = {
            time: output.time,
            selectedFileName: selectedFiles[channelIndex],
        }
        socketServer.emit(
            ServerToClientCommand.TIME_TALLY_UPDATE,
            timeTallyData
        )
        socketServer.emit(
            ServerToClientCommand.THUMBNAIL_UPDATE,
            channelIndex,
            output.thumbnailList
        )
        socketServer.emit(
            ServerToClientCommand.MEDIA_UPDATE,
            channelIndex,
            output.mediaFiles
        )
    })
    socketServer.emit(ServerToClientCommand.TIME_TALLY_UPDATE, timeTallyData)
}

function cleanUpMediaFiles(): void {
    mediaService.getOutputs(state.media).forEach(({}, channelIndex: number) => {
        reduxStore.dispatch(updateMediaFiles(channelIndex, []))
        reduxStore.dispatch(updateThumbnailFileList(channelIndex, []))
        assignThumbnailsToOutputs()
    })
}
