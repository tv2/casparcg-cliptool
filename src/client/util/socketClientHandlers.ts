import { reduxState, reduxStore } from '../../model/reducers/store'
import * as IO from '../../model/socketIoConstants'

import io from 'socket.io-client'
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
    setWeb,
    updateSettings,
} from '../../model/reducers/settingsAction'
import { setConnectionStatus } from '../../model/reducers/appNavAction'
import { OperationMode, Settings } from '../../model/reducers/settingsModels'
import {
    HiddenFileInfo,
    MediaFile,
    ThumbnailFile,
} from '../../model/reducers/mediaModels'

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
    .on(IO.MEDIA_UPDATE, (channelIndex: number, payload: MediaFile[]) => {
        reduxStore.dispatch(updateMediaFiles(channelIndex, payload))
        console.log('Client state :', reduxState)
    })

socket.on(IO.FOLDERS_UPDATE, (payload: string[]) => {
    reduxStore.dispatch(updateFolderList(payload))
})

socket.on(IO.THUMB_UPDATE, (channelIndex: number, payload: ThumbnailFile[]) => {
    reduxStore.dispatch(updateThumbnailFileList(channelIndex, payload))
})

socket.on(
    IO.HIDDEN_FILES_UPDATE,
    (hiddenFiles: Record<string, HiddenFileInfo>) => {
        reduxStore.dispatch(updateHiddenFiles(hiddenFiles))
    }
)

socket.on(IO.TIME_TALLY_UPDATE, (data: IO.TimeTallyPayload[]) => {
    data.forEach((channel, index) => {
        reduxStore.dispatch(setTime(index, channel.time))
        if (
            reduxState.settings[0].generics.outputs[index].selectedFile !==
            channel.tally
        ) {
            //console.log('Tally', index, channel.tally)
            reduxStore.dispatch(setSelectedFileName(index, channel.tally))
        }
    })
})

socket.on(IO.LOOP_STATE_UPDATE, (channelIndex: number, loop: boolean) => {
    reduxStore.dispatch(setLoop(channelIndex, loop))
})

socket.on(
    IO.OPERATION_MODE_UPDATE,
    (channelIndex: number, mode: OperationMode) => {
        reduxStore.dispatch(setOperationMode(channelIndex, mode))
    }
)

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

socket.on(IO.SETTINGS_UPDATE, (payload: Settings) => {
    reduxStore.dispatch(setNumberOfOutputs(payload.ccgConfig.channels.length))
    reduxStore.dispatch(setGenerics(payload.generics))
    reduxStore.dispatch(
        updateSettings(payload.ccgConfig.channels, payload.ccgConfig.path)
    )
    reduxStore.dispatch(setTabData(payload.tabData.length))
})
