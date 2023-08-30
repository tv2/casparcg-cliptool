// @ts-ignore
import osc from 'osc' //Using OSC fork from PieceMeta/osc.js as it has excluded hardware serialport support and thereby is crossplatform
import { state, reduxStore } from '../../shared/store'
import {
    setNumberOfOutputs,
    setTime,
    updateFolders,
    updateMediaFiles,
    updateHiddenFiles,
} from '../../shared/actions/media-actions'

import {
    HiddenFileInfo,
    HiddenFiles,
    MediaFile,
    Output,
    ThumbnailFile,
} from '../../shared/models/media-models'

import {
    setGenerics,
    updateSettings,
} from '../../shared/actions/settings-action'
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
import {
    OperationMode,
    OutputSettings,
} from '../../shared/models/settings-models'
import { ReduxSettingsService } from '../../shared/services/redux-settings-service'
import { OsService } from '../../shared/services/os-service'
import { ReduxMediaService } from '../../shared/services/redux-media-service'
import {
    ServerToClientCommand,
    TimeSelectedFilePayload,
} from '../../shared/socket-io-constants'
import { UtilityService } from '../../shared/services/utility-service'
import { defaultOutputSettingsState } from '../../shared/schemas/new-settings-schema'
import { SettingsPersistenceService } from '../services/settings-persistence-service'
import { HiddenFilesPersistenceService } from '../services/hidden-files-persistence-service'
import { CasparCgHandlerService } from '../services/casparcg-handler-service'
import { ExpressService } from '../services/express-service'

let waitingForCasparcgResponse: boolean = false

const reduxMediaService = new ReduxMediaService()
const reduxSettingsService = new ReduxSettingsService()
const utilityService = new UtilityService()
const casparCgHandlerService = CasparCgHandlerService.instance
const expressService = ExpressService.instance
const socketIoServerHandlerService =
    expressService.getSocketIoServerHandlerService()
const hiddenFilesPersistenceService = new HiddenFilesPersistenceService(
    reduxSettingsService
)
const settingsPersistenceService = new SettingsPersistenceService(
    reduxSettingsService
)
let fileChangesInterval: NodeJS.Timeout | undefined

//Communication with CasparCG consists of 2 parts:
//1. An AMCP connection for receiving media info and sending commands, which is created in the 'casparcg-handler-service'
//2. An OSC connection for receiving realtime info about the media playing on the outputs

//Setup OSC Connection:
function ccgOSCServer(): void {
    const oscConnection = new osc.UDPPort({
        localAddress: '0.0.0.0',
        localPort: reduxSettingsService.getGenericSettings(state.settings)
            .ccgSettings.oscPort,
    })

    oscConnection
        .on('ready', () => {
            const osService = new OsService()
            let ipAddresses = osService.getIpAddresses()

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
            reduxSettingsService.getGenericSettings(state.settings).ccgSettings
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

function setNewTime(channelIndex: number, newTime: [number, number]): void {
    const output = reduxMediaService.getOutput(state.media, channelIndex)
    if (!output) {
        return
    }
    const oldTime = output.time
    if (newTime[0] !== oldTime[0] || newTime[1] !== oldTime[1]) {
        reduxStore.dispatch(setTime(channelIndex, newTime))
    }
}

function dispatchConfig(config: any): void {
    logger.data(config.channels).info('CasparCG Config : ')
    reduxStore.dispatch(setNumberOfOutputs(config.channels.length))
    reduxStore.dispatch(updateSettings(config.channels, config.paths.mediaPath))
    fillInDefaultOutputSettingsIfNeeded(config.channels.length)
    const genericSettings = {
        ...reduxSettingsService.getGenericSettings(state.settings),
    }
    const allOutputSettings = [...genericSettings.outputSettings]

    config.channels.forEach(({}, index: number) => {
        const outputSettings = { ...allOutputSettings[index] }
        allOutputSettings[index] = reinvigorateChannel(outputSettings, index)
    })
    genericSettings.outputSettings = allOutputSettings
    reduxStore.dispatch(setGenerics(genericSettings))
    logger.info(`Number of Channels: ${config.channels.length}`)
    expressService
        .getSocketServer()
        .emit(ServerToClientCommand.SETTINGS_UPDATE, state.settings)
    socketIoServerHandlerService.initializeClient()
}

function reinvigorateChannel(
    outputSettings: OutputSettings,
    index: number
): OutputSettings {
    const cuedFileName = outputSettings.cuedFileName
    if (cuedFileName) {
        logger.info(`Re-loaded ${cuedFileName} on channel index ${index}.`)
        loadMedia(index, 9, cuedFileName)
    }

    outputSettings.loopState = outputSettings.loopState ?? false
    outputSettings.manualStartState = outputSettings.manualStartState ?? false
    outputSettings.mixState = outputSettings.mixState ?? false
    outputSettings.webState = outputSettings.webState ?? false
    outputSettings.operationMode =
        outputSettings.operationMode ?? OperationMode.CONTROL

    return outputSettings
}

function fillInDefaultOutputSettingsIfNeeded(minimumOutputs: number) {
    const genericSettings = {
        ...reduxSettingsService.getGenericSettings(state.settings),
    }

    if (genericSettings.outputSettings.length < minimumOutputs) {
        const expandedOutputSettings =
            utilityService.expandArrayWithDefaultsIfNeeded(
                [...genericSettings.outputSettings],
                defaultOutputSettingsState,
                minimumOutputs
            )
        genericSettings.outputSettings = expandedOutputSettings
        reduxStore.dispatch(setGenerics(genericSettings))
        settingsPersistenceService.save(genericSettings)
    }
}

function loadInitialOverlay(): void {
    if (
        !reduxSettingsService.getGenericSettings(state.settings).outputSettings
    ) {
        return
    }
    state.settings.ccgConfig.channels.forEach(({}, index) => {
        const outputSettings = reduxSettingsService.getOutputSettings(
            state.settings,
            index
        )
        if (outputSettings.webState) {
            playOverlay(index, 10, outputSettings.webUrl)
        }
    })
}

function ccgAMPHandler(): void {
    //Check CCG Version and initialise OSC server:
    logger.debug('Checking CasparCG connection')
    casparCgHandlerService
        .getCasparCgConnection()
        .version()
        .then((response) => {
            const genericSettings = reduxSettingsService.getGenericSettings(
                state.settings
            )
            const address = genericSettings.ccgSettings.ip
            const port = genericSettings.ccgSettings.amcpPort
            logger.info(`AMCP connection established to: ${address}:${port}`)
            logger.info(`CasparCG Server Version: ${response.response.data}`)
            casparCgHandlerService
                .getCasparCgConnection()
                .getCasparCGConfig()
                .then((config) => {
                    dispatchConfig(config)
                    waitingForCasparcgResponse = false
                    startTimeEmitInterval()
                    loadInitialOverlay()
                })
                .catch((error) =>
                    logger.data(error).error('Error receiving CCG Config:')
                )
        })
        .catch((error) =>
            logger.data(error).error('No connection to CasparCG ')
        )
    startFileChangesPollingInterval()
}

function startTimeEmitInterval() {
    //Update of timeleft is set to a default 40ms (same as 25FPS)
    let data: TimeSelectedFilePayload[] = []
    reduxStore.subscribe(() => {
        reduxMediaService
            .getOutputs(state.media)
            .forEach((output: Output, index: number) => {
                const outputSettings = reduxSettingsService.getOutputSettings(
                    state.settings,
                    index
                )
                data[index] = {
                    time: output.time,
                    selectedFileName: outputSettings.selectedFileName,
                }
            })
    })
    setInterval(() => {
        expressService
            .getSocketServer()
            .emit(ServerToClientCommand.TIME_TALLY_UPDATE, data)
    }, 40)
}

async function startFileChangesPollingInterval(): Promise<void> {
    if (fileChangesInterval) {
        clearInterval(fileChangesInterval)
        fileChangesInterval = undefined
    }
    await getFileChanges()
    await getThumbnailChanges()
    fileChangesInterval = setInterval(async () => {
        if (waitingForCasparcgResponse) {
            return
        }
        waitingForCasparcgResponse = true
        try {
            await getFileChanges()
            await getThumbnailChanges()
        } finally {
            waitingForCasparcgResponse = false
        }
    }, 3000)
}

async function getFileChanges(): Promise<void> {
    logger.trace('Polling for File Changes.')
    await loadFileList()
}

async function getThumbnailChanges(): Promise<void> {
    logger.trace('Polling for Thumbnail Changes.')
    const newThumbnails = await loadCcgThumbnails()
    if (!newThumbnails.hasChanges) {
        return
    }
    casparCgHandlerService.updateStoredThumbnails(newThumbnails.thumbnails)
    casparCgHandlerService.assignThumbnailsToOutputs(
        expressService.getSocketServer()
    )
}

async function loadCcgThumbnails(): Promise<{
    thumbnails: ThumbnailFile[]
    hasChanges: boolean
}> {
    const thumbnailFiles: any = await casparCgHandlerService
        .getCasparCgConnection()
        .thumbnailList()
        .catch((reason) => {
            logger
                .data(reason)
                .warn(
                    'Caught failed attempt to retrieve thumbnails from CasparCG, with the reason:'
                )
        })
    if (!thumbnailFiles) {
        return {
            thumbnails: casparCgHandlerService.getStoredPreviousThumbnails(),
            hasChanges: false,
        }
    }
    let newThumbnails: ThumbnailFile[] =
        casparCgHandlerService.getStoredThumbnails()
    let hasChanges = false
    if (
        hasThumbnailListChanged(
            thumbnailFiles.response.data,
            casparCgHandlerService.getStoredPreviousThumbnails()
        )
    ) {
        casparCgHandlerService.updateStoredPreviousThumbnails(
            thumbnailFiles.response.data
        )
        newThumbnails = []
        hasChanges = true
        for await (const thumbnailFile of thumbnailFiles.response.data) {
            await loadThumbnailImage(thumbnailFile).then(
                (thumbnailImage: ThumbnailFile) => {
                    newThumbnails.push(thumbnailImage)
                }
            )
        }
    }
    return { thumbnails: newThumbnails, hasChanges: hasChanges }
}

async function loadFileList(): Promise<void> {
    casparCgHandlerService
        .getCasparCgConnection()
        .cls() //AMCP list media files
        .then((payload) => {
            if (payload.response.data.length === 0) {
                logger.warn(
                    'Received no files from CasparCG when requesting them. Are the media folder empty or the path misconfigured?'
                )
            }
            reduxStore.dispatch(
                updateFolders(extractFoldersList(payload.response.data))
            )
            expressService
                .getSocketServer()
                .emit(ServerToClientCommand.FOLDERS_UPDATE, state.media.folders)

            extractFilesToOutputs(payload.response.data)
            fixInvalidUsedPathsInSettings(payload.response.data)
            checkHiddenFilesChanged(payload.response.data)
        })
        .catch((error) => {
            logger
                .data(error)
                .warn(
                    'Caught failed attempt to retrieve file list from CasparCG, with the reason:'
                )
        })
}

function extractFilesToOutputs(allFiles: MediaFile[]): void {
    const outputs = reduxMediaService.getOutputs(state.media)
    if (outputs.length !== state.settings.ccgConfig.channels.length) {
        logger.warn(
            `Expected ${state.settings.ccgConfig.channels.length} Outputs but had ${outputs.length}`
        )
    }
    outputs.forEach((output: Output, outputIndex: number) => {
        extractFilesToOutput(allFiles, outputIndex, output)
    })
}

function extractFilesToOutput(
    allFiles: MediaFile[],
    outputIndex: number,
    output: Output
): void {
    const outputFolder = reduxSettingsService.getOutputSettings(
        state.settings,
        outputIndex
    ).folder
    const outputMediaFiles = allFiles.filter(
        (file) =>
            isFolderNameEqual(file.name, outputFolder) &&
            !isAlphaFile(file.name)
    )
    if (!isDeepCompareEqual(output.mediaFiles, outputMediaFiles)) {
        logger.info(`Media files changed for output: ${outputIndex}`)
        reduxStore.dispatch(updateMediaFiles(outputIndex, outputMediaFiles))
        expressService
            .getSocketServer()
            .emit(
                ServerToClientCommand.MEDIA_UPDATE,
                outputIndex,
                outputMediaFiles
            )
    }
}

function fixInvalidUsedPathsInSettings(allFiles: MediaFile[]): void {
    const outputSettingsWithFixedPaths = reduxSettingsService
        .getAllOutputSettings(state.settings)
        .map((outputSettings) =>
            reduxSettingsService.clearInvalidTargetedPaths(
                allFiles,
                outputSettings,
                state.media
            )
        )
    if (
        !isDeepCompareEqual(
            reduxSettingsService.getAllOutputSettings(state.settings),
            outputSettingsWithFixedPaths
        )
    ) {
        saveFixedPathsSettings(outputSettingsWithFixedPaths)
    }
}

function saveFixedPathsSettings(
    outputSettingsWithFixedPaths: OutputSettings[]
) {
    logger.warn(
        'Removing some invalid paths from settings, that likely exist due to folders/files being deleted while off.'
    )
    const genericSettings = { ...state.settings.generics }
    genericSettings.outputSettings = outputSettingsWithFixedPaths
    reduxStore.dispatch(setGenerics(genericSettings))
    casparCgHandlerService.assignThumbnailsToOutputs(
        expressService.getSocketServer()
    )
    new SettingsPersistenceService().save()
}

function checkHiddenFilesChanged(files: MediaFile[]): void {
    let needsUpdating = false
    const hiddenFiles: HiddenFiles = state.media.hiddenFiles
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
        expressService
            .getSocketServer()
            .emit(ServerToClientCommand.HIDDEN_FILES_UPDATE, hiddenFiles)
        hiddenFilesPersistenceService.save(hiddenFiles)
    }
}

async function loadThumbnailImage(
    element: ThumbnailFile
): Promise<ThumbnailFile> {
    const thumbnail = await casparCgHandlerService
        .getCasparCgConnection()
        .thumbnailRetrieve(element.name)
    return {
        name: element.name,
        changed: element.changed,
        size: element.size,
        type: element.type,
        thumbnail: thumbnail.response.data,
    }
}

export function casparCgClient(): void {
    ccgAMPHandler()
    ccgOSCServer()
}
