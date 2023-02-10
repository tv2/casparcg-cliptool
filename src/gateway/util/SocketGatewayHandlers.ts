import { reduxState, reduxStore } from '../../model/reducers/store'
import * as IO from '../../model/SocketIoConstants'

// import io from 'socket.io-client'
import {
    setManualStart,
    setLoop,
    setMix,
    setTallyFileName,
    setTime,
    updateMediaFiles,
    updateThumbFileList,
    updateFolderList,
    setNumberOfOutputs,
    setIsHiding,
} from '../../model/reducers/mediaActions'
import { IMediaFile, IThumbFile } from '../../model/reducers/mediaReducer'
import {
    setGenerics,
    setTabData,
    updateSettings,
} from '../../model/reducers/settingsAction'
import { ISettings } from '../../model/reducers/settingsReducer'
import { ARG_CONSTANTS } from './extractArgs'
import { logger } from './loggerGateway'

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

socket.on(IO.MEDIA_UPDATE, (channelIndex: number, mediaFiles: IMediaFile[]) => {
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
    (channelIndex: number, thumbnailFiles: IThumbFile[]) => {
        reduxStore.dispatch(updateThumbFileList(channelIndex, thumbnailFiles))

        logger
            .data(thumbnailFiles)
            .debug(`Thumbs updated channel index ${channelIndex} with:`)
    }
)

socket.on(IO.TIME_TALLY_UPDATE, (data: IO.ITimeTallyPayload[]) => {
    data.forEach((channel, index) => {
        reduxStore.dispatch(setTime(index, channel.time))
        if (reduxState.media[0].output[index].tallyFile !== channel.tally) {
            reduxStore.dispatch(setTallyFileName(index, channel.tally))
        }
    })
})

socket.on(IO.LOOP_STATE_UPDATE, (channelIndex: number, loop: boolean) => {
    reduxStore.dispatch(setLoop(channelIndex, loop))
    console.log('Loop State updated')
})

socket.on(
    IO.IS_HIDING_STATE_UPDATE,
    (channelIndex: number, isHiding: boolean) => {
        reduxStore.dispatch(setIsHiding(channelIndex, isHiding))
        console.log('IsHiding State updated')
    }
)

socket.on(IO.MIX_STATE_UPDATE, (channelIndex: number, mix: boolean) => {
    reduxStore.dispatch(setMix(channelIndex, mix))
    console.log('Mix State updated')
})

socket.on(
    IO.MANUAL_START_STATE_UPDATE,
    (channelIndex: number, manualstart: boolean) => {
        reduxStore.dispatch(setManualStart(channelIndex, manualstart))
        console.log('Manual State updated')
    }
)

socket.on(IO.SETTINGS_UPDATE, (settings: ISettings) => {
    reduxStore.dispatch(setNumberOfOutputs(settings.ccgConfig.channels.length))
    reduxStore.dispatch(setGenerics(settings.generics))
    reduxStore.dispatch(
        updateSettings(settings.ccgConfig.channels, settings.ccgConfig.path)
    )
    reduxStore.dispatch(setTabData(settings.tabData.length))
})
