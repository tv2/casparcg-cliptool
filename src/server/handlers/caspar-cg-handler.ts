// @ts-ignore
import osc from 'osc' //Using OSC fork from PieceMeta/osc.js as it has excluded hardware serialport support and thereby is crossplatform

import { CasparCG } from 'casparcg-connection'
import { state, reduxStore } from '../../model/reducers/store'
import {
    setNumberOfOutputs,
    setTime,
    updateFolders,
    updateMediaFiles,
    updateThumbnailFileList,
    updateHiddenFiles,
} from '../../model/reducers/media-actions'

import { socketServer } from './express-handler'
import {
    HiddenFileInfo,
    MediaFile,
    Output,
    ThumbnailFile,
} from '../../model/reducers/media-models'

import {
    setLoop,
    setManualStart,
    setMix,
    setOperationMode,
    setWeb,
    updateSettings,
} from '../../model/reducers/settings-action'
import { initializeClient } from './socket-io-server-handler'
import {
    extractFoldersList,
    getChannelNumber,
    hasThumbnailListChanged,
    isAlphaFile,
    isDeepCompareEqual,
    isFolderNameEqual,
} from '../utils/ccg-handler-utils'
import { logger } from '../utils/logger'
import { loadMedia, playOverlay } from '../utils/ccg-load-play'
import { OperationMode } from '../../model/reducers/settings-models'
import settingsService from '../../model/services/settings-service'
import osService from '../../model/services/os-service'
import mediaService from '../../model/services/media-service'
import hiddenFilesPersistenceService from '../services/hidden-files-persistence-service'
import {
    ServerToClient,
    TimeSelectedFilePayload,
} from '../../model/socket-io-constants'

let waitingForCCGResponse: boolean = false
let previousThumbnailFileList: ThumbnailFile[] = []
let thumbNailList: ThumbnailFile[] = []

//Communication with CasparCG consists of 2 parts:
//1. An AMCP connection for receiving media info and sending commands
//2. An OSC connection for receiving realtime info about the media playing on the outputs

//Setup AMCP Connection:
export const ccgConnection = new CasparCG({
    host: settingsService.getGenericSettings(state.settings).ccgSettings.ip,
    port: settingsService.getGenericSettings(state.settings).ccgSettings
        .amcpPort,
    autoConnect: true,
})

//Setup OSC Connection:
function ccgOSCServer(): void {
    const oscConnection = new osc.UDPPort({
        localAddress: '0.0.0.0',
        localPort: settingsService.getGenericSettings(state.settings)
            .ccgSettings.oscPort,
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
        `OSC listening on port '${
            settingsService.getGenericSettings(state.settings).ccgSettings
                .oscPort
        }'.`
    )
}

function processOscMessage(message: any): void {
    let channelIndex = getChannelNumber(message.address) - 1
    if (message.address.includes('/stage/layer')) {
        processOscProducerSegment(message, channelIndex)
        processTimeOscSegment(message, channelIndex)
    }
}

enum MessageSegment {
    TIME = 'file/time',
    PRODUCER = 'foreground/producer',
}

function processOscProducerSegment(message: any, channelIndex: number): void {
    if (message.address.includes(MessageSegment.PRODUCER)) {
        const playingFileType: string = message.args[0]
        if (playingFileType === 'image') {
            setNewTime(channelIndex, [0, 0])
        }
    }
}

function processTimeOscSegment(message: any, channelIndex: number): void {
    if (message.address.includes(MessageSegment.TIME)) {
        const newTime: [number, number] = [
            parseFloat(message.args[0]),
            parseFloat(message.args[1]),
        ]
        if (!(newTime[0] === 0 && newTime[1] === 0)) {
            setNewTime(channelIndex, newTime)
        }
    }
}

function setNewTime(channelIndex: number, newTime: [number, number]) {
    const oldTime = mediaService.getOutput(state.media, channelIndex).time
    if (newTime[0] !== oldTime[0] || newTime[1] !== oldTime[1]) {
        reduxStore.dispatch(setTime(channelIndex, newTime))
    }
}

function dispatchConfig(config: any): void {
    logger.data(config.channels).info('CasparCG Config : ')
    reduxStore.dispatch(setNumberOfOutputs(config.channels.length))
    reduxStore.dispatch(updateSettings(config.channels, config.paths.mediaPath))
    config.channels.forEach(({}, index: number) => {
        const genericSettings = settingsService.getGenericSettings(
            state.settings
        )
        const cuedFileName = genericSettings.outputSettings[index].cuedFileName
        if (cuedFileName) {
            logger.info(`Re-loaded ${cuedFileName} on channel index ${index}.`)
            loadMedia(index, 9, cuedFileName)
        }
        reduxStore.dispatch(
            setLoop(
                index,
                genericSettings.outputSettings[index].loopState ?? false
            )
        )
        reduxStore.dispatch(
            setManualStart(
                index,
                genericSettings.outputSettings[index].manualStartState ?? false
            )
        )
        reduxStore.dispatch(
            setMix(
                index,
                genericSettings.outputSettings[index].mixState ?? false
            )
        )
        reduxStore.dispatch(
            setWeb(
                index,
                genericSettings.outputSettings[index].webState ?? false
            )
        )
        reduxStore.dispatch(
            setOperationMode(
                index,
                genericSettings.outputSettings[index].operationMode ??
                    OperationMode.CONTROL
            )
        )
    })
    logger.info(`Number of Channels: ${config.channels.length}`)
    socketServer.emit(ServerToClient.SETTINGS_UPDATE, state.settings)
    initializeClient()
}

function loadInitialOverlay(): void {
    if (!settingsService.getGenericSettings(state.settings).outputSettings) {
        return
    }
    state.settings.ccgConfig.channels.forEach(({}, index) => {
        playOverlay(
            index,
            10,
            settingsService.getOutputSettings(state.settings, index).webUrl
        )
    })
}

function ccgAMPHandler(): void {
    //Check CCG Version and initialise OSC server:
    logger.debug('Checking CasparCG connection')
    ccgConnection
        .version()
        .then((response) => {
            const genericSettings = settingsService.getGenericSettings(
                state.settings
            )
            const address = genericSettings.ccgSettings.ip
            const port = genericSettings.ccgSettings.amcpPort
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
    let data: TimeSelectedFilePayload[] = []
    reduxStore.subscribe(() => {
        mediaService
            .getOutputs(state.media)
            .forEach((output: Output, index: number) => {
                data[index] = {
                    time: output.time,
                    selectedFileName: settingsService.getOutputSettings(
                        state.settings,
                        index
                    ).selectedFileName,
                }
            })
    })
    setInterval(() => {
        socketServer.emit(ServerToClient.TIME_TALLY_UPDATE, data)
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
    let thumbnailFiles: any = await ccgConnection.thumbnailList()

    if (
        hasThumbnailListChanged(
            thumbnailFiles.response.data,
            previousThumbnailFileList
        )
    ) {
        previousThumbnailFileList = thumbnailFiles.response.data
        thumbNailList = []
        for await (const thumbFile of thumbnailFiles.response.data) {
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
                updateFolders(extractFoldersList(payload.response.data))
            )
            socketServer.emit(
                ServerToClient.FOLDERS_UPDATE,
                state.media.folders
            )

            mediaService
                .getOutputs(state.media)
                .forEach(({}, outputIndex: number) => {
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
                settingsService.getOutputSettings(state.settings, outputIndex)
                    .folder
            ) && !isAlphaFile(file.name)
        )
    })
    const mediaFiles = mediaService.getOutput(
        state.media,
        outputIndex
    ).mediaFiles
    if (!isDeepCompareEqual(mediaFiles, outputMedia)) {
        logger.info(`Media files changed for output: ${outputIndex}`)
        reduxStore.dispatch(updateMediaFiles(outputIndex, outputMedia))
        socketServer.emit(ServerToClient.MEDIA_UPDATE, outputIndex, outputMedia)
    }
}

function checkHiddenFilesChanged(files: MediaFile[]): void {
    let needsUpdating = false
    const hiddenFiles: Record<string, HiddenFileInfo> = state.media.hiddenFiles
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
        socketServer.emit(ServerToClient.HIDDEN_FILES_UPDATE, hiddenFiles)
        hiddenFilesPersistenceService.save()
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
    mediaService.getOutputs(state.media).forEach(({}, channelIndex: number) => {
        let outputMedia = thumbNailList.filter((thumbnail: ThumbnailFile) => {
            return isFolderNameEqual(
                thumbnail?.name,
                settingsService.getOutputSettings(state.settings, channelIndex)
                    .folder
            )
        })
        const outputThumbnailList = mediaService.getOutput(
            state.media,
            channelIndex
        ).thumbnailList
        if (!isDeepCompareEqual(outputThumbnailList, outputMedia)) {
            reduxStore.dispatch(
                updateThumbnailFileList(channelIndex, outputMedia)
            )
            socketServer.emit(
                ServerToClient.THUMBNAIL_UPDATE,
                channelIndex,
                outputMedia
            )
        }
    })
}

export function casparCgClient(): void {
    ccgAMPHandler()
    ccgOSCServer()
}
