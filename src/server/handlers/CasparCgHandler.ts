//Node Modules:
import osc from 'osc' //Using OSC fork from PieceMeta/osc.js as it has excluded hardware serialport support and thereby is crossplatform

//Modules:
import { CasparCG } from 'casparcg-connection'
import { reduxState, reduxStore } from '../../model/reducers/store'
import {
    setNumberOfOutputs,
    setTime,
    updateFolderList,
    updateMediaFiles,
    updateThumbFileList,
    updateHiddenFiles,
} from '../../model/reducers/mediaActions'

import { socketServer } from './expressHandler'
import * as IO from '../../model/SocketIoConstants'
import {
    HiddenFileInfo,
    MediaFile,
    Output,
    ThumbnailFile,
} from '../../model/reducers/mediaReducer'

import {
    setLoop,
    setManualStart,
    setMix,
    setOperationMode,
    setSelectedFileName,
    setTabData,
    setWeb,
    updateSettings,
} from '../../model/reducers/settingsAction'
import { initializeClient } from './socketIOServerHandler'
import {
    extractFoldersList,
    getChannelNumber,
    getLayerNumber,
    getThisMachineIpAddresses,
    hasThumbListChanged,
    isAlphaFile,
    isDeepCompareEqual,
    isFolderNameEqual,
} from '../utils/ccgHandlerUtils'
import { logger } from '../utils/logger'
import { playOverlay } from '../utils/CcgLoadPlay'
import { saveHiddenFiles } from '../utils/hiddenFilesStorage'
import mediaService from '../../model/services/mediaService'
import {
    OperationMode,
    OutputSettings,
} from '../../model/reducers/settingsModels'

let waitingForCCGResponse: boolean = false
let previousThumbFileList = []
let thumbNailList: ThumbnailFile[] = []

//Communication with CasparCG consists of 2 parts:
//1. An AMCP connection for receiving media info and sending commands
//2. An OSC connection for receiving realtime info about the media playing on the outputs

//Setup AMCP Connection:
export const ccgConnection = new CasparCG({
    host: reduxState.settings[0].generics.ccgIp,
    port: reduxState.settings[0].generics.ccgAmcpPort,
    autoConnect: true,
})

//Setup OSC Connection:
const ccgOSCServer = () => {
    const oscConnection = new osc.UDPPort({
        localAddress: '0.0.0.0',
        localPort: reduxState.settings[0].generics.ccgOscPort,
    })

    oscConnection
        .on('ready', () => {
            let ipAddresses = getThisMachineIpAddresses()

            logger.info('Listening for OSC over UDP.')
            ipAddresses.forEach((address) =>
                logger.info(
                    `OSC Host: ${address}:${oscConnection.options.localPort}`
                )
            )
        })
        .on('message', (message: any) => {
            handleOscMessage(message)
        })
        .on('error', (error: any) => {
            logger.data(error).error('Error in OSC receive')
        })

    oscConnection.open()
    logger.info(`OSC listening on port 5253`)
}

const handleOscMessage = (message: any) => {
    let channelIndex = getChannelNumber(message.address) - 1
    let layerIndex = getLayerNumber(message.address) - 1

    if (message.address.includes('/stage/layer')) {
        if (
            message.address.includes('file/path') &&
            !message.address.includes('keyer')
        ) {
            if (layerIndex === 9) {
                let fileName = message.args[0]
                if (
                    reduxState.settings[0].generics.outputs[channelIndex]
                        ?.selectedFile !== fileName
                ) {
                    reduxStore.dispatch(
                        setSelectedFileName(channelIndex, fileName)
                    )
                    reduxStore.dispatch(setTime(channelIndex, [0, 0]))
                }
            }
        }
        if (message.address.includes('file/time')) {
            reduxStore.dispatch(
                setTime(channelIndex, [
                    parseFloat(message.args[0]),
                    parseFloat(message.args[1]),
                ])
            )
        }
    }
}

const dispatchConfig = (config: any) => {
    logger.data(config.channels).info('CasparCG Config : ')
    reduxStore.dispatch(setNumberOfOutputs(config.channels.length))
    reduxStore.dispatch(updateSettings(config.channels, config.paths.mediaPath))
    reduxStore.dispatch(setTabData(config.channels.length))
    config.channels.forEach(({}, index: number) => {
        reduxStore.dispatch(
            setLoop(
                index,
                reduxState.settings[0].generics.outputs[index].loopState ??
                    false
            )
        )
        reduxStore.dispatch(
            setManualStart(
                index,
                reduxState.settings[0].generics.outputs[index]
                    .manualStartState ?? false
            )
        )
        reduxStore.dispatch(
            setMix(
                index,
                reduxState.settings[0].generics.outputs[index].mixState ?? false
            )
        )
        reduxStore.dispatch(
            setWeb(
                index,
                reduxState.settings[0].generics.outputs[index].webState ?? false
            )
        )
        reduxStore.dispatch(
            setOperationMode(
                index,
                reduxState.settings[0].generics.outputs[index].operationMode ??
                    OperationMode.CONTROL
            )
        )
    })
    logger.info(`Number of Channels: ${config.channels.length}`)
    socketServer.emit(IO.SETTINGS_UPDATE, reduxState.settings[0])
    initializeClient()
}

const loadInitialOverlay = () => {
    if (!reduxState.settings[0].generics.outputs) {
        return
    }
    reduxState.settings[0].ccgConfig.channels.forEach((ch, index) => {
        playOverlay(
            index,
            10,
            reduxState.settings[0].generics.outputs[index].webUrl
        )
    })
}

const ccgAMPHandler = () => {
    //Check CCG Version and initialise OSC server:
    logger.debug('Checking CasparCG connection')
    ccgConnection
        .version()
        .then((response) => {
            const address = reduxState.settings[0].generics.ccgIp
            const port = reduxState.settings[0].generics.ccgAmcpPort
            logger.info(`AMCP connection established to: ${address}:${port}`)
            logger.info(`CasparCG Server Version: ${response.response.data}`)
            ccgConnection
                .getCasparCGConfig()
                .then((config) => {
                    dispatchConfig(config)
                    waitingForCCGResponse = false
                    loadInitialOverlay()
                })
                .catch((error) =>
                    logger.data(error).error('Error receiving CCG Config:')
                )
        })
        .catch((error) =>
            logger.data(error).error('No connection to CasparCG ')
        )
    startTimerControlledServices()
}

const startTimerControlledServices = async () => {
    //Update of timeleft is set to a default 40ms (same as 25FPS)
    let data: IO.ITimeTallyPayload[] = []

    setInterval(() => {
        reduxState.settings[0].generics.outputs.forEach(
            (output: OutputSettings, index: number) => {
                data[index] = {
                    time: mediaService.getOutput(reduxState, index).time,
                    tally: output.selectedFile,
                }
            }
        )
        socketServer.emit(IO.TIME_TALLY_UPDATE, data)
    }, 40)

    //Check media files on server:
    await loadCcgMedia()
    loadFileList()
    setInterval(() => {
        if (!waitingForCCGResponse) {
            waitingForCCGResponse = true
            loadCcgMedia().then((items: ThumbnailFile[]) => {
                thumbNailList = items
                waitingForCCGResponse = false
            })
        }
        loadFileList()
    }, 3000)
}

const loadCcgMedia = async (): Promise<ThumbnailFile[]> => {
    let thumbFiles = await ccgConnection.thumbnailList()

    if (hasThumbListChanged(thumbFiles.response.data, previousThumbFileList)) {
        previousThumbFileList = thumbFiles.response.data
        thumbNailList = []
        for await (const thumbFile of thumbFiles.response.data) {
            await loadThumbNailImage(thumbFile).then((thumbImage: any) => {
                thumbNailList.push(thumbImage)
            })
        }
        assignThumbNailListToOutputs()

        await loadFileList()
    }
    return thumbNailList
}

const loadFileList = async () => {
    ccgConnection
        .cls() //AMCP list media files
        .then((payload) => {
            reduxStore.dispatch(
                updateFolderList(extractFoldersList(payload.response.data))
            )
            socketServer.emit(IO.FOLDERS_UPDATE, reduxState.media[0].folderList)

            reduxState.media[0].output.forEach(({}, outputIndex: number) => {
                outputExtractFiles(payload.response.data, outputIndex)
            })
            checkHiddenFilesChanged(payload.response.data)
        })
        .catch((error) => {
            logger.data(error).error('Error receiving file list :')
        })
}

const outputExtractFiles = (allFiles: MediaFile[], outputIndex: number) => {
    let outputMedia = allFiles.filter((file) => {
        return (
            isFolderNameEqual(
                file.name,
                reduxState.settings[0].generics.outputs[outputIndex].folder
            ) && !isAlphaFile(file.name)
        )
    })
    if (
        !isDeepCompareEqual(
            reduxState.media[0].output[outputIndex].mediaFiles,
            outputMedia
        )
    ) {
        logger.info(`Media files changed for output: ${outputIndex}`)
        reduxStore.dispatch(updateMediaFiles(outputIndex, outputMedia))
        socketServer.emit(
            IO.MEDIA_UPDATE,
            outputIndex,
            reduxState.media[0].output[outputIndex].mediaFiles
        )
    }
}

function checkHiddenFilesChanged(files: MediaFile[]) {
    let needsUpdating = false
    const hiddenFiles: Record<string, HiddenFileInfo> =
        reduxState.media[0].hiddenFiles
    for (const key in hiddenFiles) {
        const hiddenFileInfo: HiddenFileInfo = hiddenFiles[key]
        const file = files.find((predicate) => predicate.name == key)
        if (
            !file ||
            file.changed !== hiddenFileInfo.changed ||
            file.size !== hiddenFileInfo.size
        ) {
            delete hiddenFiles[key]
            needsUpdating = true
        }
    }
    if (needsUpdating) {
        logger
            .data(hiddenFiles)
            .debug('Hidden files was updated from external changes:')
        reduxStore.dispatch(updateHiddenFiles(hiddenFiles))
        socketServer.emit(IO.HIDDEN_FILES_UPDATE, hiddenFiles)
        saveHiddenFiles()
    }
}

const loadThumbNailImage = async (element: ThumbnailFile) => {
    let thumb = await ccgConnection.thumbnailRetrieve(element.name)
    let receivedThumb: ThumbnailFile = {
        name: element.name,
        changed: element.changed,
        size: element.size,
        type: element.type,
        thumbnail: thumb.response.data,
    }
    return receivedThumb
}

export const assignThumbNailListToOutputs = () => {
    reduxState.media[0].output.forEach(({}, channelIndex: number) => {
        let outputMedia = thumbNailList.filter((thumbnail: ThumbnailFile) => {
            return isFolderNameEqual(
                thumbnail?.name,
                reduxState.settings[0].generics.outputs[channelIndex].folder
            )
        })
        if (
            !isDeepCompareEqual(
                reduxState.media[0].output[channelIndex].thumbnailList,
                outputMedia
            )
        ) {
            reduxStore.dispatch(updateThumbFileList(channelIndex, outputMedia))
            socketServer.emit(
                IO.THUMB_UPDATE,
                channelIndex,
                reduxState.media[0].output[channelIndex].thumbnailList
            )
        }
    })
}

export const casparCgClient = () => {
    ccgAMPHandler()
    ccgOSCServer()
}
