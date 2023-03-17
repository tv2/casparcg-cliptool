import { reduxState, reduxStore } from '../../model/reducers/store'
import { logger } from '../utils/logger'
import * as IO from '../../model/SocketIoConstants'

import { socketServer } from './expressHandler'
import {
    mixMedia,
    playMedia,
    loadMedia,
    playOverlay,
    stopOverlay,
} from '../utils/CcgLoadPlay'
import {
    updateMediaFiles,
    updateThumbFileList,
    updateHiddenFiles,
} from '../../model/reducers/mediaActions'
import {
    setGenerics,
    setLoop,
    setManualStart,
    setMix,
    setOperationMode,
    setWeb,
} from '../../model/reducers/settingsAction'
import { saveSettings } from '../utils/SettingsStorage'
import { HiddenFileInfo, MediaFile } from '../../model/reducers/mediaModels'
import { assignThumbNailListToOutputs } from './CasparCgHandler'
import { saveHiddenFiles } from '../utils/hiddenFilesStorage'
import settingsService from '../../model/services/settingsService'
import mediaService from '../../model/services/mediaService'
import {
    GenericSettings,
    OperationMode,
    OutputSettings,
} from '../../model/reducers/settingsModels'

export function socketIoHandlers(socket: any): void {
    logger.info('SETTING UP SOCKET IO MAIN HANDLERS')

    socketServer.emit(IO.SETTINGS_UPDATE, reduxState.settings[0])
    initializeClient()

    socket
        .on(IO.GET_SETTINGS, () => {
            socketServer.emit(IO.SETTINGS_UPDATE, reduxState.settings[0])
        })
        .on(
            IO.TOGGLE_THUMBNAIL_VISIBILITY,
            (channelIndex: number, fileName: string) => {
                if (
                    reduxState.settings[0].generics.outputs.some(
                        (output) => output.selectedFile === fileName
                    )
                ) {
                    return
                }

                const hiddenFiles = reduxState.media[0].hiddenFiles
                try {
                    const updatedHiddenFiles = toggleHiddenFile(
                        fileName,
                        channelIndex,
                        hiddenFiles
                    )
                    reduxStore.dispatch(updateHiddenFiles(updatedHiddenFiles))
                    saveHiddenFiles()

                    socketServer.emit(
                        IO.HIDDEN_FILES_UPDATE,
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
        .on(IO.PGM_PLAY, (channelIndex: number, fileName: string) => {
            if (
                !settingsService.getOutputSettings(reduxState, channelIndex)
                    .mixState
            ) {
                playMedia(channelIndex, 9, fileName)
            } else {
                mixMedia(channelIndex, 9, fileName)
            }
            logger.info(`Playing ${fileName} on channel index ${channelIndex}.`)
        })
        .on(IO.PGM_LOAD, (channelIndex: number, fileName: string) => {
            loadMedia(channelIndex, 9, fileName)
            logger.info(`Loading ${fileName} on channel index ${channelIndex}.`)
        })
        .on(IO.SET_LOOP_STATE, (channelIndex: number, state: boolean) => {
            reduxStore.dispatch(setLoop(channelIndex, state))
            socketServer.emit(
                IO.LOOP_STATE_UPDATE,
                channelIndex,
                settingsService.getOutputSettings(reduxState, channelIndex)
                    .loopState
            )
        })
        .on(
            IO.SET_OPERATION_MODE,
            (channelIndex: number, mode: OperationMode) => {
                reduxStore.dispatch(setOperationMode(channelIndex, mode))
                socketServer.emit(
                    IO.OPERATION_MODE_UPDATE,
                    channelIndex,
                    settingsService.getOutputSettings(reduxState, channelIndex)
                        .operationMode
                )
            }
        )
        .on(
            IO.SET_MANUAL_START_STATE,
            (channelIndex: number, state: boolean) => {
                reduxStore.dispatch(setManualStart(channelIndex, state))
                socketServer.emit(
                    IO.MANUAL_START_STATE_UPDATE,
                    channelIndex,
                    settingsService.getOutputSettings(reduxState, channelIndex)
                        .manualStartState
                )
            }
        )
        .on(IO.SET_MIX_STATE, (channelIndex: number, state: boolean) => {
            reduxStore.dispatch(setMix(channelIndex, state))
            socketServer.emit(
                IO.MIX_STATE_UPDATE,
                channelIndex,
                settingsService.getOutputSettings(reduxState, channelIndex)
                    .mixState
            )
        })
        .on(IO.SET_WEB_STATE, (channelIndex: number, state: boolean) => {
            reduxStore.dispatch(setWeb(channelIndex, state))
            socketServer.emit(
                IO.WEB_STATE_UPDATE,
                channelIndex,
                settingsService.getOutputSettings(reduxState, channelIndex)
                    .webState
            )
            if (
                settingsService.getOutputSettings(reduxState, channelIndex)
                    .webState
            ) {
                const webUrl = settingsService.getOutputSettings(
                    reduxState,
                    channelIndex
                ).webUrl
                playOverlay(channelIndex, 10, webUrl)
                logger.info(
                    `Overlay playing ${webUrl} on channel index ${channelIndex}.`
                )
            } else {
                stopOverlay(channelIndex, 10)
            }
        })
        .on(IO.SET_GENERICS, (generics: GenericSettings) => {
            logger.info('Updating and storing generic settings serverside.')
            reduxStore.dispatch(setGenerics(generics))
            saveSettings()
            socketServer.emit(IO.SETTINGS_UPDATE, reduxState.settings[0])
            cleanUpMediaFiles()
        })
        .on(IO.RESTART_SERVER, () => {
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

function findFile(fileName: string, channelIndex: number): MediaFile {
    return reduxState.media[0].outputs[channelIndex].mediaFiles.find(
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
    socketServer.emit(IO.TAB_DATA_UPDATE, reduxState.settings[0].tabData)
    let timeTallyData: IO.ITimeTallyPayload[] = []
    reduxState.settings[0].generics.outputs.forEach(
        (output: OutputSettings, channelIndex: number) => {
            timeTallyData[channelIndex] = {
                time: mediaService.getOutput(reduxState, channelIndex).time,
                tally: output.selectedFile,
            }

            socketServer.emit(IO.TIME_TALLY_UPDATE, timeTallyData)
            socketServer.emit(
                IO.LOOP_STATE_UPDATE,
                channelIndex,
                output.loopState
            )
            socketServer.emit(
                IO.OPERATION_MODE_UPDATE,
                channelIndex,
                output.operationMode
            )
            socketServer.emit(
                IO.MIX_STATE_UPDATE,
                channelIndex,
                output.mixState
            )
            socketServer.emit(
                IO.MANUAL_START_STATE_UPDATE,
                channelIndex,
                output.manualStartState
            )
            socketServer.emit(
                IO.THUMB_UPDATE,
                channelIndex,
                reduxState.media[0].outputs[channelIndex].thumbnailList
            )
            socketServer.emit(
                IO.MEDIA_UPDATE,
                channelIndex,
                reduxState.media[0].outputs[channelIndex].mediaFiles
            )
            socketServer.emit(
                IO.HIDDEN_FILES_UPDATE,
                reduxState.media[0].hiddenFiles
            )
        }
    )
    socketServer.emit(IO.TIME_TALLY_UPDATE, timeTallyData)
}

function cleanUpMediaFiles(): void {
    reduxState.media[0].outputs.forEach(({}, channelIndex: number) => {
        reduxStore.dispatch(updateMediaFiles(channelIndex, []))
        reduxStore.dispatch(updateThumbFileList(channelIndex, []))
        assignThumbNailListToOutputs()
    })
}
