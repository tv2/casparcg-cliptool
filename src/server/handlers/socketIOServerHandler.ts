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
    setLoop,
    setMix,
    setManualStart,
    updateMediaFiles,
    updateThumbFileList,
    setWeb,
    setOperationMode,
    updateHiddenFiles,
} from '../../model/reducers/mediaActions'
import { setGenerics } from '../../model/reducers/settingsAction'
import { IGenericSettings } from '../../model/reducers/settingsReducer'
import { saveSettings } from '../utils/SettingsStorage'
import {
    IHiddenFileInfo,
    IMedia,
    IMediaFile,
    IOutput,
    OperationMode,
} from '../../model/reducers/mediaReducer'
import { assignThumbNailListToOutputs } from './CasparCgHandler'
import { loadHiddenFiles, saveHiddenFiles } from '../utils/hiddenFilesStorage'

export function socketIoHandlers(socket: any) {
    logger.info('SETTING UP SOCKET IO MAIN HANDLERS')

    socketServer.emit(IO.SETTINGS_UPDATE, reduxState.settings[0])
    loadHiddenFiles()
    initializeClient()

    socket
        .on(IO.GET_SETTINGS, () => {
            socketServer.emit(IO.SETTINGS_UPDATE, reduxState.settings[0])
        })
        .on(
            IO.TOGGLE_THUMBNAIL_VISIBILITY,
            (channelIndex: number, fileName: string) => {
                const hiddenFiles =
                    reduxState.media[0].output[channelIndex].hiddenFiles
                try {
                    const updatedHiddenFiles = toggleHiddenFile(
                        fileName,
                        channelIndex,
                        hiddenFiles
                    )
                    reduxStore.dispatch(
                        updateHiddenFiles(channelIndex, updatedHiddenFiles)
                    )
                    saveHiddenFiles()

                    socketServer.emit(
                        IO.HIDDEN_FILES_UPDATE,
                        channelIndex,
                        updatedHiddenFiles
                    )
                } catch {
                    console.error(
                        'Error thrown during "TOGGLE_THUMBNAIL_VISIBILITY"'
                    )
                }
            }
        )
        .on(IO.PGM_PLAY, (channelIndex: number, fileName: string) => {
            if (!reduxState.media[0].output[channelIndex].mixState) {
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
                reduxState.media[0].output[channelIndex].loopState
            )
        })
        .on(
            IO.SET_OPERATION_MODE,
            (channelIndex: number, mode: OperationMode) => {
                reduxStore.dispatch(setOperationMode(channelIndex, mode))
                socketServer.emit(
                    IO.OPERATION_MODE_UPDATE,
                    channelIndex,
                    reduxState.media[0].output[channelIndex].operationMode
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
                    reduxState.media[0].output[channelIndex].manualstartState
                )
            }
        )
        .on(IO.SET_MIX_STATE, (channelIndex: number, state: boolean) => {
            reduxStore.dispatch(setMix(channelIndex, state))
            socketServer.emit(
                IO.MIX_STATE_UPDATE,
                channelIndex,
                reduxState.media[0].output[channelIndex].mixState
            )
        })
        .on(IO.SET_WEB_STATE, (channelIndex: number, state: boolean) => {
            reduxStore.dispatch(setWeb(channelIndex, state))
            socketServer.emit(
                IO.WEB_STATE_UPDATE,
                channelIndex,
                reduxState.media[0].output[channelIndex].webState
            )
            if (reduxState.media[0].output[channelIndex].webState) {
                const webUrl =
                    reduxState.settings[0].generics.webURL?.[channelIndex]
                playOverlay(channelIndex, 10, webUrl)
                logger.info(
                    `Overlay playing ${webUrl} on channel index ${channelIndex}.`
                )
            } else {
                stopOverlay(channelIndex, 10)
            }
        })
        .on(IO.SET_GENERICS, (generics: IGenericSettings) => {
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

function toggleHiddenFile(
    fileName: string,
    channelIndex: number,
    hiddenFilesOrig: Record<string, IHiddenFileInfo>
): Record<string, IHiddenFileInfo> {
    const hiddenFiles = { ...hiddenFilesOrig }
    if (fileName in hiddenFiles) {
        delete hiddenFiles[fileName]
        return hiddenFiles
    }

    const hiddenFile = buildHiddenFileMetadataFromFileName(
        fileName,
        channelIndex
    )
    hiddenFiles[fileName] = hiddenFile
    return hiddenFiles
}

function buildHiddenFileMetadataFromFileName(
    fileName: string,
    channelIndex: number
): IHiddenFileInfo {
    const file = reduxState.media[0].output[channelIndex].mediaFiles.find(
        (file) => file.name.toUpperCase() === fileName.toUpperCase()
    )
    if (!file) {
        throw new Error(`No such file: ${fileName}`)
    }
    return buildHiddenFileMetadata(file)
}

function buildHiddenFileMetadata(file: IMediaFile): IHiddenFileInfo {
    return {
        changed: file.changed,
        size: file.size,
    }
}

export const initializeClient = () => {
    socketServer.emit(IO.TAB_DATA_UPDATE, reduxState.settings[0].tabData)
    let timeTallyData: IO.ITimeTallyPayload[] = []
    reduxState.media[0].output.forEach(
        (output: IOutput, channelIndex: number) => {
            timeTallyData[channelIndex] = {
                time: output.time,
                tally: output.tallyFile,
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
                output.manualstartState
            )
            socketServer.emit(
                IO.THUMB_UPDATE,
                channelIndex,
                reduxState.media[0].output[channelIndex].thumbnailList
            )
            socketServer.emit(
                IO.MEDIA_UPDATE,
                channelIndex,
                reduxState.media[0].output[channelIndex].mediaFiles
            )
            socketServer.emit(
                IO.HIDDEN_FILES_UPDATE,
                channelIndex,
                output.hiddenFiles
            )
        }
    )
    socketServer.emit(IO.TIME_TALLY_UPDATE, timeTallyData)
}

const cleanUpMediaFiles = () => {
    reduxState.media[0].output.forEach(
        (output: IOutput, channelIndex: number) => {
            reduxStore.dispatch(updateMediaFiles(channelIndex, []))
            reduxStore.dispatch(updateThumbFileList(channelIndex, []))
            assignThumbNailListToOutputs()
        }
    )
}
