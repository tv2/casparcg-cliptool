import { state, reduxStore } from '../../model/reducers/store'
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
} from '../../model/reducers/media-actions'
import {
    setGenerics,
    setCuedFileName,
    setLoop,
    setManualStart,
    setMix,
    setOperationMode,
    setSelectedFileName,
    setWeb,
} from '../../model/reducers/settings-action'
import { HiddenFileInfo, MediaFile } from '../../model/reducers/media-models'
import { assignThumbnailListToOutputs } from './caspar-cg-handler'
import settingsService from '../../model/services/settings-service'
import mediaService from '../../model/services/media-service'
import {
    GenericSettings,
    OperationMode,
    OutputSettings,
} from '../../model/reducers/settings-models'
import settingsPersistenceService from '../services/settings-persistence-service'
import hiddenFilesPersistenceService from '../services/hidden-files-persistence-service'
import {
    ClientToServer,
    GET_SETTINGS,
    ServerToClient,
    TimeSelectedFilePayload,
} from '../../model/socket-io-constants'

export function socketIoHandlers(socket: any): void {
    logger.info('SETTING UP SOCKET IO MAIN HANDLERS')

    socketServer.emit(ServerToClient.SETTINGS_UPDATE, state.settings)
    initializeClient()

    socket
        .on(GET_SETTINGS, () => {
            socketServer.emit(ServerToClient.SETTINGS_UPDATE, state.settings)
        })
        .on(
            ClientToServer.TOGGLE_THUMBNAIL_VISIBILITY,
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
                    hiddenFilesPersistenceService.save()

                    socketServer.emit(
                        ServerToClient.HIDDEN_FILES_UPDATE,
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
            ClientToServer.PGM_PLAY,
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
                    ServerToClient.FILE_CUED_UPDATE,
                    channelIndex,
                    ''
                )
                reduxStore.dispatch(setSelectedFileName(channelIndex, fileName))
                settingsPersistenceService.save()
                socketServer.emit(
                    ServerToClient.FILE_SELECTED_UPDATE,
                    channelIndex,
                    fileName
                )
            }
        )
        .on(
            ClientToServer.PGM_LOAD,
            (channelIndex: number, fileName: string) => {
                loadMedia(channelIndex, 9, fileName)
                reduxStore.dispatch(setCuedFileName(channelIndex, fileName))
                socketServer.emit(
                    ServerToClient.FILE_CUED_UPDATE,
                    channelIndex,
                    fileName
                )
                reduxStore.dispatch(setSelectedFileName(channelIndex, ''))
                socketServer.emit(
                    ServerToClient.FILE_SELECTED_UPDATE,
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
            ClientToServer.SET_LOOP_STATE,
            (channelIndex: number, loopState: boolean) => {
                reduxStore.dispatch(setLoop(channelIndex, loopState))
                settingsPersistenceService.save()
                socketServer.emit(
                    ServerToClient.LOOP_STATE_UPDATE,
                    channelIndex,
                    settingsService.getOutputSettings(
                        state.settings,
                        channelIndex
                    ).loopState
                )
            }
        )
        .on(
            ClientToServer.SET_OPERATION_MODE,
            (channelIndex: number, mode: OperationMode) => {
                reduxStore.dispatch(setOperationMode(channelIndex, mode))
                socketServer.emit(
                    ServerToClient.OPERATION_MODE_UPDATE,
                    channelIndex,
                    settingsService.getOutputSettings(
                        state.settings,
                        channelIndex
                    ).operationMode
                )
            }
        )
        .on(
            ClientToServer.SET_MANUAL_START_STATE,
            (channelIndex: number, manualStartState: boolean) => {
                reduxStore.dispatch(
                    setManualStart(channelIndex, manualStartState)
                )
                settingsPersistenceService.save()
                socketServer.emit(
                    ServerToClient.MANUAL_START_STATE_UPDATE,
                    channelIndex,
                    settingsService.getOutputSettings(
                        state.settings,
                        channelIndex
                    ).manualStartState
                )
            }
        )
        .on(
            ClientToServer.SET_MIX_STATE,
            (channelIndex: number, mixState: boolean) => {
                reduxStore.dispatch(setMix(channelIndex, mixState))
                settingsPersistenceService.save()
                socketServer.emit(
                    ServerToClient.MIX_STATE_UPDATE,
                    channelIndex,
                    settingsService.getOutputSettings(
                        state.settings,
                        channelIndex
                    ).mixState
                )
            }
        )
        .on(
            ClientToServer.SET_WEB_STATE,
            (channelIndex: number, webState: boolean) => {
                reduxStore.dispatch(setWeb(channelIndex, webState))
                settingsPersistenceService.save()
                socketServer.emit(
                    ServerToClient.WEB_STATE_UPDATE,
                    channelIndex,
                    settingsService.getOutputSettings(
                        state.settings,
                        channelIndex
                    ).webState
                )
                if (
                    settingsService.getOutputSettings(
                        state.settings,
                        channelIndex
                    ).webState
                ) {
                    const webUrl = settingsService.getOutputSettings(
                        state.settings,
                        channelIndex
                    ).webUrl
                    playOverlay(channelIndex, 10, webUrl)
                    logger.info(
                        `Overlay playing ${webUrl} on channel index ${channelIndex}.`
                    )
                } else {
                    stopOverlay(channelIndex, 10)
                }
            }
        )
        .on(ClientToServer.SET_GENERICS, (generics: GenericSettings) => {
            logger.data(generics).trace('Save Settings')
            logger.info('Updating and storing generic settings server side.')
            reduxStore.dispatch(setGenerics(generics))
            settingsPersistenceService.save()
            socketServer.emit(ServerToClient.SETTINGS_UPDATE, state.settings)
            cleanUpMediaFiles()
        })
        .on(ClientToServer.RESTART_SERVER, () => {
            process.exit(0)
        })
}

type HiddenFiles = Record<string, HiddenFileInfo>
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
    const hiddenFile = buildHiddenFileMetadataFromFileName(
        fileName,
        channelIndex
    )
    return { ...hiddenFiles, [fileName]: hiddenFile }
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
                    ServerToClient.LOOP_STATE_UPDATE,
                    channelIndex,
                    output.loopState
                )
                socketServer.emit(
                    ServerToClient.OPERATION_MODE_UPDATE,
                    channelIndex,
                    output.operationMode
                )
                socketServer.emit(
                    ServerToClient.MIX_STATE_UPDATE,
                    channelIndex,
                    output.mixState
                )
                socketServer.emit(
                    ServerToClient.MANUAL_START_STATE_UPDATE,
                    channelIndex,
                    output.manualStartState
                )
                socketServer.emit(
                    ServerToClient.HIDDEN_FILES_UPDATE,
                    state.media.hiddenFiles
                )
            }
        )
    mediaService.getOutputs(state.media).forEach((output, channelIndex) => {
        timeTallyData[channelIndex] = {
            time: output.time,
            selectedFileName: selectedFiles[channelIndex],
        }
        socketServer.emit(ServerToClient.TIME_TALLY_UPDATE, timeTallyData)
        socketServer.emit(
            ServerToClient.THUMBNAIL_UPDATE,
            channelIndex,
            output.thumbnailList
        )
        socketServer.emit(
            ServerToClient.MEDIA_UPDATE,
            channelIndex,
            output.mediaFiles
        )
    })
    socketServer.emit(ServerToClient.TIME_TALLY_UPDATE, timeTallyData)
}

function cleanUpMediaFiles(): void {
    mediaService.getOutputs(state.media).forEach(({}, channelIndex: number) => {
        reduxStore.dispatch(updateMediaFiles(channelIndex, []))
        reduxStore.dispatch(updateThumbnailFileList(channelIndex, []))
        assignThumbnailListToOutputs()
    })
}
