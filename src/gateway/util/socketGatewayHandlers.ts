import { reduxState, reduxStore } from '../../model/reducers/store'
import * as IO from '../../model/socketIoConstants'

// import io from 'socket.io-client'
import {
    setTime,
    updateMediaFiles,
    updateThumbnailFileList,
    updateFolderList,
    setNumberOfOutputs,
    updateHiddenFiles,
} from '../../model/reducers/mediaActions'

import {
    setGenerics,
    setLoop,
    setManualStart,
    setMix,
    setOperationMode,
    setSelectedFileName,
    setTabData,
    updateSettings,
} from '../../model/reducers/settingsAction'
import { ARG_CONSTANTS } from './extractArgs'
import { logger } from './loggerGateway'
import { MediaFile, ThumbnailFile } from '../../model/reducers/mediaModels'
import { OperationMode, Settings } from '../../model/reducers/settingsModels'

logger.info(`Connecting Socket to: ${ARG_CONSTANTS.clipToolHost}`)

export const socket = require('socket.io-client')(
    `${ARG_CONSTANTS.clipToolHost}`,
    {
        transports: ['websocket'],
    }
)

socket.on('connect', () => logger.info('Connected to ClipTool'))

socket.on('connect_error', (error: unknown) =>
    logger.data(error).error(`Socket Client Error:`)
)

socket.on('connect_timeout', () =>
    logger.warn('Socket Client connect_timeout.')
)

socket.on('Socket Client reconnect_attempt', () =>
    logger.debug('reconnect_attempt')
)

socket.on(IO.MEDIA_UPDATE, (channelIndex: number, mediaFiles: MediaFile[]) => {
    reduxStore.dispatch(updateMediaFiles(channelIndex, mediaFiles))

    logger
        .data(mediaFiles)
        .debug(
            `Media list updated channel index ${channelIndex} with ${mediaFiles}.`
        )
})

socket.on(IO.FOLDERS_UPDATE, (payload: string[]) => {
    reduxStore.dispatch(updateFolderList(payload))

    logger.data(payload).debug(`Folderlist updated Payload:`)
})

socket.on(
    IO.THUMB_UPDATE,
    (channelIndex: number, thumbnailFiles: ThumbnailFile[]) => {
        reduxStore.dispatch(
            updateThumbnailFileList(channelIndex, thumbnailFiles)
        )

        logger
            .data(thumbnailFiles)
            .debug(`Thumbs updated channel index ${channelIndex} with:`)
    }
)

socket.on(IO.TIME_TALLY_UPDATE, (data: IO.TimeTallyPayload[]) => {
    data.forEach((channel, index) => {
        reduxStore.dispatch(setTime(index, channel.time))
        if (
            reduxState.settings[0].generics.outputs[index].selectedFile !==
            channel.tally
        ) {
            reduxStore.dispatch(setSelectedFileName(index, channel.tally))
        }
    })
})

socket.on(IO.LOOP_STATE_UPDATE, (channelIndex: number, loop: boolean) => {
    reduxStore.dispatch(setLoop(channelIndex, loop))
    console.log('Loop State updated')
})

socket.on(
    IO.OPERATION_MODE_UPDATE,
    (channelIndex: number, mode: OperationMode) => {
        reduxStore.dispatch(setOperationMode(channelIndex, mode))
        console.log('Operation Mode updated')
    }
)

socket.on(IO.MIX_STATE_UPDATE, (channelIndex: number, mix: boolean) => {
    reduxStore.dispatch(setMix(channelIndex, mix))
    console.log('Mix State updated')
})

socket.on(
    IO.MANUAL_START_STATE_UPDATE,
    (channelIndex: number, manualStart: boolean) => {
        reduxStore.dispatch(setManualStart(channelIndex, manualStart))
        console.log('Manual State updated')
    }
)

socket.on(IO.SETTINGS_UPDATE, (settings: Settings) => {
    reduxStore.dispatch(setNumberOfOutputs(settings.ccgConfig.channels.length))
    reduxStore.dispatch(setGenerics(settings.generics))
    reduxStore.dispatch(
        updateSettings(settings.ccgConfig.channels, settings.ccgConfig.path)
    )
    reduxStore.dispatch(setTabData(settings.tabData.length))
})
