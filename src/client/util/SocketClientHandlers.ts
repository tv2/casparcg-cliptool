import { reduxState, reduxStore } from '../../model/reducers/store'
import * as IO from '../../model/SocketIoConstants'

import io from 'socket.io-client'
import {
    setLoop,
    setTallyFileName,
    setTime,
    updateMediaFiles,
    updateThumbFileList,
} from '../../model/reducers/mediaActions'
import { IMediaFile, IThumbFile } from '../../model/reducers/mediaReducer'
import { ICcgChannel } from '../../model/reducers/channelsReducer'
import { channelSetChannels } from '../../model/reducers/channelsAction'
import { setTabData, updateSettings } from '../../model/reducers/settingsAction'
import { ISettings } from '../../model/reducers/settingsReducer'

export const socket = io()

console.log('Initialising SocketClient')

socket.on(IO.MEDIA_UPDATE, (payload: IMediaFile[]) => {
    reduxStore.dispatch(updateMediaFiles(payload))
    console.log('Client state :', reduxState)
})

socket.on(IO.THUMB_UPDATE, (payload: IThumbFile[]) => {
    reduxStore.dispatch(updateThumbFileList(payload))
})

socket.on(IO.TIME_UPDATE, (time: Array<[number, number]>) => {
    time.forEach((item, index) => {
        reduxStore.dispatch(setTime(index, item))
    })
})

socket.on(IO.TALLY_UPDATE, (payload: string[]) => {
    payload.forEach((tally: string, index: number) => {
        reduxStore.dispatch(setTallyFileName(index, tally))
    })
})

socket.on(IO.LOOP_STATEUPDATE, (loop: boolean[]) => {
    loop.forEach((item: boolean, index: number) => {
        reduxStore.dispatch(setLoop(index, item))
    })
})

socket.on(IO.SETTINGS_UPDATE, (payload: ISettings) => {
    reduxStore.dispatch(updateSettings(payload.ccgSettings.channels))
    reduxStore.dispatch(setTabData(payload.tabData))
})
