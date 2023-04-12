import { state, reduxStore } from '../../model/reducers/store'
import {
    ServerToClient,
    TimeTallyPayload,
} from '../../model/socket-io-constants'

import io from 'socket.io-client'
import {
    setTime,
    updateMediaFiles,
    updateThumbnailFileList,
    updateFolders,
    setNumberOfOutputs,
    updateHiddenFiles,
} from '../../model/reducers/media-actions'
import {
    setGenerics,
    setLoadedFileName,
    setLoop,
    setManualStart,
    setMix,
    setOperationMode,
    setSelectedFileName,
    setWeb,
    updateSettings,
} from '../../model/reducers/settings-action'
import { setConnectionStatus } from '../../model/reducers/app-navigation-action'
import { OperationMode, Settings } from '../../model/reducers/settings-models'
import {
    HiddenFileInfo,
    MediaFile,
    ThumbnailFile,
} from '../../model/reducers/media-models'
import settingsService from '../../model/services/settings-service'

export const socket = io()

console.log('initializing SocketClient')

socket
    .on('connect', () => {
        reduxStore.dispatch(setConnectionStatus(true))
        console.log('CONNECTED TO CLIPTOOL SERVER')
    })
    .on('disconnect', () => {
        reduxStore.dispatch(setConnectionStatus(false))
        console.log('LOST CONNECTION TO CLIPTOOL SERVER')
    })
    .on(
        ServerToClient.MEDIA_UPDATE,
        (channelIndex: number, payload: MediaFile[]) => {
            reduxStore.dispatch(updateMediaFiles(channelIndex, payload))
            console.log('Client state :', state)
        }
    )

socket.on(ServerToClient.FOLDERS_UPDATE, (payload: string[]) => {
    reduxStore.dispatch(updateFolders(payload))
})

socket.on(
    ServerToClient.THUMBNAIL_UPDATE,
    (channelIndex: number, payload: ThumbnailFile[]) => {
        reduxStore.dispatch(updateThumbnailFileList(channelIndex, payload))
    }
)

socket.on(
    ServerToClient.HIDDEN_FILES_UPDATE,
    (hiddenFiles: Record<string, HiddenFileInfo>) => {
        reduxStore.dispatch(updateHiddenFiles(hiddenFiles))
    }
)

socket.on(ServerToClient.TIME_TALLY_UPDATE, (data: TimeTallyPayload[]) => {
    data.forEach((channel, index) => {
        reduxStore.dispatch(setTime(index, channel.time))
        if (
            settingsService.getOutputSettings(state.settings, index)
                .selectedFile !== channel.tally
        ) {
            reduxStore.dispatch(setSelectedFileName(index, channel.tally))
        }
    })
})

socket.on(
    ServerToClient.FILE_LOADED_UPDATE,
    (channelIndex: number, fileName: string) => {
        reduxStore.dispatch(setLoadedFileName(channelIndex, fileName))
    }
)

socket.on(
    ServerToClient.FILE_SELECTED_UPDATE,
    (channelIndex: number, fileName: string) => {
        reduxStore.dispatch(setSelectedFileName(channelIndex, fileName))
    }
)

socket.on(
    ServerToClient.LOOP_STATE_UPDATE,
    (channelIndex: number, loop: boolean) => {
        reduxStore.dispatch(setLoop(channelIndex, loop))
    }
)

socket.on(
    ServerToClient.OPERATION_MODE_UPDATE,
    (channelIndex: number, mode: OperationMode) => {
        reduxStore.dispatch(setOperationMode(channelIndex, mode))
    }
)

socket.on(
    ServerToClient.MIX_STATE_UPDATE,
    (channelIndex: number, mix: boolean) => {
        reduxStore.dispatch(setMix(channelIndex, mix))
    }
)

socket.on(
    ServerToClient.WEB_STATE_UPDATE,
    (channelIndex: number, web: boolean) => {
        reduxStore.dispatch(setWeb(channelIndex, web))
    }
)

socket.on(
    ServerToClient.MANUAL_START_STATE_UPDATE,
    (channelIndex: number, manualStart: boolean) => {
        reduxStore.dispatch(setManualStart(channelIndex, manualStart))
    }
)

socket.on(ServerToClient.SETTINGS_UPDATE, (payload: Settings) => {
    reduxStore.dispatch(setNumberOfOutputs(payload.ccgConfig.channels.length))
    reduxStore.dispatch(setGenerics(payload.generics))
    reduxStore.dispatch(
        updateSettings(payload.ccgConfig.channels, payload.ccgConfig.path)
    )
})
