import { reduxState, reduxStore } from '../../model/reducers/store'
import * as IO from '../../model/SocketIoConstants'

import io from 'socket.io-client'
import {
    setTallyFileName,
    updateMediaFiles,
    updateThumbFileList,
} from '../../model/reducers/mediaActions'
import { IMediaFile, IThumbFile } from '../../model/reducers/mediaReducer'
import { ICcgChannel } from '../../model/reducers/channelsReducer'
import { channelSetChannels } from '../../model/reducers/channelsAction'

export const socket = io()

console.log('Initialising SocketClient')

socket.on(IO.MEDIA_UPDATE, (payload: IMediaFile[]) => {
    reduxStore.dispatch(updateMediaFiles(payload))
    console.log('Client state :', reduxState)
})

socket.on(IO.THUMB_UPDATE, (payload: IThumbFile[]) => {
    reduxStore.dispatch(updateThumbFileList(payload))
})

socket.on(IO.CHANNELS_UPDATE, (payload: ICcgChannel[]) => {
    reduxStore.dispatch(channelSetChannels(payload))
})

socket.on(IO.TALLY_UPDATE, (payload: string[]) => {
    payload.forEach((tally: string, index: number) => {
        reduxStore.dispatch(setTallyFileName(index, tally))
    })
})
