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

socket.on('connect', () => {
    console.log('Connected to ClipTool')
})

socket.on('connect_error', (err) => {
    console.log(`Socket Client Error : ${err}`)
})

socket.on('connect_timeout', () => {
    console.log('Socket Client connect_timeout')
})

socket.on('Socker Client reconnect_attempt', () => {
    console.log('reconnect_attempt')
})

socket.on(IO.MEDIA_UPDATE, (channelIndex: number, payload: IMediaFile[]) => {
    reduxStore.dispatch(updateMediaFiles(channelIndex, payload))

    logger.debug(
        `Media list updated Channel : ${channelIndex} Payload : ${payload}`
    )
})

socket.on(IO.FOLDERS_UPDATE, (payload: string[]) => {
    reduxStore.dispatch(updateFolderList(payload))

    logger.debug(`Folderlist updated Payload : ${payload}`)
})

socket.on(IO.THUMB_UPDATE, (channelIndex: number, payload: IThumbFile[]) => {
    reduxStore.dispatch(updateThumbFileList(channelIndex, payload))

    logger.debug(
        `Thumbs updated Channel : ${channelIndex} Payload : ${payload}`
    )
})

socket.on(IO.TIME_TALLY_UPDATE, (data: IO.ITimeTallyPayload[]) => {
    data.forEach((channel, index) => {
        reduxStore.dispatch(setTime(index, channel.time))
        if (reduxState.media[0].output[index].tallyFile !== channel.tally) {
            reduxStore.dispatch(setTallyFileName(index, channel.tally))
        }
    })
})

socket.on(IO.LOOP_STATEUPDATE, (channelIndex: number, loop: boolean) => {
    reduxStore.dispatch(setLoop(channelIndex, loop))
    console.log('Loop State updated')
})

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

socket.on(IO.SETTINGS_UPDATE, (payload: ISettings) => {
    reduxStore.dispatch(setNumberOfOutputs(payload.ccgConfig.channels.length))
    reduxStore.dispatch(setGenerics(payload.generics))
    reduxStore.dispatch(updateSettings(payload.ccgConfig.channels))
    reduxStore.dispatch(setTabData(payload.tabData.length))
})
