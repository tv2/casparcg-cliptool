import { state, reduxStore } from '../../shared/store'

import {
    setTime,
    updateMediaFiles,
    updateThumbnailFileList,
    updateFolders,
    setNumberOfOutputs,
} from '../../shared/actions/media-actions'

import {
    setGenerics,
    setLoop,
    setManualStart,
    setMix,
    setOperationMode,
    setSelectedFileName,
    updateSettings,
} from '../../shared/actions/settings-action'
import { ARG_CONSTANTS } from './extract-args'
import { logger } from './logger-gateway'
import { MediaFile, ThumbnailFile } from '../../shared/models/media-models'
import { OperationMode, Settings } from '../../shared/models/settings-models'
import settingsService from '../../shared/services/settings-service'
import {
    ServerToClient,
    TimeSelectedFilePayload,
} from '../../shared/socket-io-constants'

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

socket.on(
    ServerToClient.MEDIA_UPDATE,
    (channelIndex: number, mediaFiles: MediaFile[]) => {
        reduxStore.dispatch(updateMediaFiles(channelIndex, mediaFiles))

        logger
            .data(mediaFiles)
            .debug(
                `Media list updated channel index ${channelIndex} with ${mediaFiles}.`
            )
    }
)

socket.on(ServerToClient.FOLDERS_UPDATE, (payload: string[]) => {
    reduxStore.dispatch(updateFolders(payload))

    logger.data(payload).debug(`Folders updated Payload:`)
})

socket.on(
    ServerToClient.THUMBNAIL_UPDATE,
    (channelIndex: number, thumbnailFiles: ThumbnailFile[]) => {
        reduxStore.dispatch(
            updateThumbnailFileList(channelIndex, thumbnailFiles)
        )

        logger
            .data(thumbnailFiles)
            .debug(`Thumbs updated channel index ${channelIndex} with:`)
    }
)

socket.on(
    ServerToClient.TIME_TALLY_UPDATE,
    (data: TimeSelectedFilePayload[]) => {
        data.forEach((channel, index) => {
            reduxStore.dispatch(setTime(index, channel.time))
            if (
                settingsService.getOutputSettings(state.settings, index)
                    .selectedFileName !== channel.selectedFileName
            ) {
                reduxStore.dispatch(
                    setSelectedFileName(index, channel.selectedFileName)
                )
            }
        })
    }
)

socket.on(
    ServerToClient.LOOP_STATE_UPDATE,
    (channelIndex: number, loop: boolean) => {
        reduxStore.dispatch(setLoop(channelIndex, loop))
        console.log('Loop State updated')
    }
)

socket.on(
    ServerToClient.OPERATION_MODE_UPDATE,
    (channelIndex: number, mode: OperationMode) => {
        reduxStore.dispatch(setOperationMode(channelIndex, mode))
        console.log('Operation Mode updated')
    }
)

socket.on(
    ServerToClient.MIX_STATE_UPDATE,
    (channelIndex: number, mix: boolean) => {
        reduxStore.dispatch(setMix(channelIndex, mix))
        console.log('Mix State updated')
    }
)

socket.on(
    ServerToClient.MANUAL_START_STATE_UPDATE,
    (channelIndex: number, manualStart: boolean) => {
        reduxStore.dispatch(setManualStart(channelIndex, manualStart))
        console.log('Manual State updated')
    }
)

socket.on(ServerToClient.SETTINGS_UPDATE, (settings: Settings) => {
    reduxStore.dispatch(setNumberOfOutputs(settings.ccgConfig.channels.length))
    reduxStore.dispatch(setGenerics(settings.generics))
    reduxStore.dispatch(
        updateSettings(settings.ccgConfig.channels, settings.ccgConfig.path)
    )
})
