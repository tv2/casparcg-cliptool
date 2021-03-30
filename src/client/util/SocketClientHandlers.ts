import { reduxStore } from '../../model/reducers/store'
import * as IO from '../../model/SocketIoConstants'

import io from 'socket.io-client'
import {
    updateMediaFiles,
    updateThumbFileList,
} from '../../model/reducers/mediaActions'
import { IMediaFile, IThumbFile } from '../../model/reducers/mediaReducer'

export const socket = io()

socket.on(IO.MEDIA_UPDATE, (payload: IMediaFile[]) => {
    reduxStore.dispatch(updateMediaFiles(payload))
})

socket.on(IO.THUMB_UPDATE, (payload: IThumbFile[]) => {
    reduxStore.dispatch(updateThumbFileList(payload))
})
