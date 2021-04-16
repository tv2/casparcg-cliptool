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
} from '../../model/reducers/mediaActions'
import { IMediaFile, IThumbFile } from '../../model/reducers/mediaReducer'
import {
    setGenerics,
    setTabData,
    updateSettings,
} from '../../model/reducers/settingsAction'
import { ISettings } from '../../model/reducers/settingsReducer'

export const socket = io()

console.log('Initialising SocketClient')

socket.on(IO.MEDIA_UPDATE, (channelIndex: number, payload: IMediaFile[]) => {
    reduxStore.dispatch(updateMediaFiles(channelIndex, payload))
    console.log('Client state :', reduxState)
})

socket.on(IO.FOLDERS_UPDATE, (payload: string[]) => {
    reduxStore.dispatch(updateFolderList(payload))
})

socket.on(IO.THUMB_UPDATE, (channelIndex: number, payload: IThumbFile[]) => {
    reduxStore.dispatch(updateThumbFileList(channelIndex, payload))
})

socket.on(IO.TIME_UPDATE, (index: number, time: [number, number]) => {
    reduxStore.dispatch(setTime(index, time))
})

socket.on(IO.TALLY_UPDATE, (index: number, payload: string) => {
    reduxStore.dispatch(setTallyFileName(index, payload))
})

socket.on(IO.LOOP_STATEUPDATE, (channelIndex: number, loop: boolean) => {
    reduxStore.dispatch(setLoop(channelIndex, loop))
})

socket.on(IO.MIX_STATE_UPDATE, (channelIndex: number, mix: boolean) => {
    reduxStore.dispatch(setMix(channelIndex, mix))
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
    reduxStore.dispatch(updateSettings(payload.ccgConfig.channels))
    reduxStore.dispatch(setTabData(payload.tabData.length))
})
