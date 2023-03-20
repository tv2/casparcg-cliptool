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
    updateThumbnailFileList,
    updateHiddenFiles,
} from '../../model/reducers/mediaActions'

import { socketServer } from './expressHandler'
import * as IO from '../../model/socketIoConstants'
import {
    HiddenFileInfo,
    MediaFile,
    Output,
    ThumbnailFile,
} from '../../model/reducers/mediaModels'

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
    hasThumbnailListChanged,
    isAlphaFile,
    isDeepCompareEqual,
    isFolderNameEqual,
} from '../utils/ccgHandlerUtils'
import { logger } from '../utils/logger'
import { playOverlay } from '../utils/ccgLoadPlay'
import { saveHiddenFiles } from '../utils/hiddenFilesStorage'
import { OperationMode } from '../../model/reducers/settingsModels'
import settingsService from '../../model/services/settingsService'
import osService from '../../model/services/osService'

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
function ccgOSCServer(): void {
    const oscConnection = new osc.UDPPort({
        localAddress: '0.0.0.0',
        localPort: reduxState.settings[0].generics.ccgOscPort,
    })

    oscConnection
        .on('ready', () => {
            let ipAddresses = osService.getThisMachineIpAddresses()

            logger.info('Listening for OSC over UDP.')
            ipAddresses.forEach((address) =>
                logger.info(
                    `OSC Host: ${address}:${oscConnection.options.localPort}`
                )
            )
        })
        .on('message', (message: any) => {
            processOscMessage(message)
        })
        .on('error', (error: any) => {
            logger.data(error).error('Error in OSC receive')
        })

    oscConnection.open()
    logger.info(
        `OSC listening on port '${reduxState.settings[0].generics.ccgOscPort}'.`
    )
}

function processOscMessage(message: any): void {
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
                    console.log('Message Filtered', message)
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

function dispatchConfig(config: any): void {
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

function loadInitialOverlay(): void {
    if (!reduxState.settings[0].generics.outputs) {
        return
    }
    reduxState.settings[0].ccgConfig.channels.forEach(({}, index) => {
        playOverlay(
            index,
            10,
            settingsService.getOutputSettings(reduxState, index).webUrl
        )
    })
}

function ccgAMPHandler(): void {
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

async function startTimerControlledServices(): Promise<void> {
    //Update of timeleft is set to a default 40ms (same as 25FPS)
    let data: IO.TimeTallyPayload[] = []

    setInterval(() => {
        reduxState.media[0].outputs.forEach((output: Output, index: number) => {
            data[index] = {
                time: output.time,
                tally: settingsService.getOutputSettings(reduxState, index)
                    .selectedFile,
            }
        })
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

async function loadCcgMedia(): Promise<ThumbnailFile[]> {
    let thumbFiles = await ccgConnection.thumbnailList()

    if (
        hasThumbnailListChanged(thumbFiles.response.data, previousThumbFileList)
    ) {
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

async function loadFileList(): Promise<void> {
    ccgConnection
        .cls() //AMCP list media files
        .then((payload) => {
            reduxStore.dispatch(
                updateFolderList(extractFoldersList(payload.response.data))
            )
            socketServer.emit(IO.FOLDERS_UPDATE, reduxState.media[0].folderList)

            reduxState.media[0].outputs.forEach(({}, outputIndex: number) => {
                outputExtractFiles(payload.response.data, outputIndex)
            })
            checkHiddenFilesChanged(payload.response.data)
        })
        .catch((error) => {
            logger.data(error).error('Error receiving file list :')
        })
}

function outputExtractFiles(allFiles: MediaFile[], outputIndex: number): void {
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
            reduxState.media[0].outputs[outputIndex].mediaFiles,
            outputMedia
        )
    ) {
        logger.info(`Media files changed for output: ${outputIndex}`)
        reduxStore.dispatch(updateMediaFiles(outputIndex, outputMedia))
        socketServer.emit(
            IO.MEDIA_UPDATE,
            outputIndex,
            reduxState.media[0].outputs[outputIndex].mediaFiles
        )
    }
}

function checkHiddenFilesChanged(files: MediaFile[]): void {
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

async function loadThumbNailImage(
    element: ThumbnailFile
): Promise<ThumbnailFile> {
    let thumbnail = await ccgConnection.thumbnailRetrieve(element.name)
    let receivedThumbnail: ThumbnailFile = {
        name: element.name,
        changed: element.changed,
        size: element.size,
        type: element.type,
        thumbnail: thumbnail.response.data,
    }
    return receivedThumbnail
}

export function assignThumbNailListToOutputs(): void {
    reduxState.media[0].outputs.forEach(({}, channelIndex: number) => {
        let outputMedia = thumbNailList.filter((thumbnail: ThumbnailFile) => {
            return isFolderNameEqual(
                thumbnail?.name,
                reduxState.settings[0].generics.outputs[channelIndex].folder
            )
        })
        if (
            !isDeepCompareEqual(
                reduxState.media[0].outputs[channelIndex].thumbnailList,
                outputMedia
            )
        ) {
            reduxStore.dispatch(
                updateThumbnailFileList(channelIndex, outputMedia)
            )
            socketServer.emit(
                IO.THUMB_UPDATE,
                channelIndex,
                reduxState.media[0].outputs[channelIndex].thumbnailList
            )
        }
    })
}

export function casparCgClient(): void {
    ccgAMPHandler()
    ccgOSCServer()
}
