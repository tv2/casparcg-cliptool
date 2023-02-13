import { reduxState, reduxStore } from '../../model/reducers/store'
import * as IO from '../../model/SocketIoConstants'

import io from 'socket.io-client'
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
    setWeb,
    setVisibility,
} from '../../model/reducers/mediaActions'
import { IMediaFile, IThumbFile } from '../../model/reducers/mediaReducer'
import {
    setGenerics,
    setTabData,
    updateSettings,
} from '../../model/reducers/settingsAction'
import { ISettings } from '../../model/reducers/settingsReducer'
import {
    setConnectionStatus,
    SET_CONNECTION_STATUS,
} from '../../model/reducers/appNavAction'

export const socket = io()

console.log('Initialising SocketClient')

socket
    .on('connect', () => {
        reduxStore.dispatch(setConnectionStatus(true))
        console.log('CONNECTED TO CLIPTOOL SERVER')
    })
    .on('disconnect', () => {
        reduxStore.dispatch(setConnectionStatus(false))
        console.log('LOST CONNECTION TO CLIPTOOL SERVER')
    })
    .on(IO.MEDIA_UPDATE, (channelIndex: number, payload: IMediaFile[]) => {
        reduxStore.dispatch(updateMediaFiles(channelIndex, payload))
        console.log('Client state :', reduxState)
    })

socket.on(IO.FOLDERS_UPDATE, (payload: string[]) => {
    reduxStore.dispatch(updateFolderList(payload))
})

socket.on(IO.THUMB_UPDATE, (channelIndex: number, payload: IThumbFile[]) => {
    reduxStore.dispatch(updateThumbFileList(channelIndex, payload))
})

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
})

socket.on(IO.VISIBILITY_STATE_UPDATE, (channelIndex: number, hide: boolean) => {
    reduxStore.dispatch(setVisibility(channelIndex, hide))
})

socket.on(IO.MIX_STATE_UPDATE, (channelIndex: number, mix: boolean) => {
    reduxStore.dispatch(setMix(channelIndex, mix))
})

socket.on(IO.WEB_STATE_UPDATE, (channelIndex: number, web: boolean) => {
    reduxStore.dispatch(setWeb(channelIndex, web))
})

socket.on(
    IO.MANUAL_START_STATE_UPDATE,
    (channelIndex: number, manualstart: boolean) => {
        reduxStore.dispatch(setManualStart(channelIndex, manualstart))
    }
)

socket.on(IO.SETTINGS_UPDATE, (payload: ISettings) => {
    reduxStore.dispatch(setNumberOfOutputs(payload.ccgConfig.channels.length))
    reduxStore.dispatch(setGenerics(payload.generics))
    reduxStore.dispatch(
        updateSettings(payload.ccgConfig.channels, payload.ccgConfig.path)
    )
    reduxStore.dispatch(setTabData(payload.tabData.length))
})
