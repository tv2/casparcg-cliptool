import { setConnectionStatus } from '../../model/reducers/app-navigation-action'
import io from 'socket.io-client'
import {
    setNumberOfOutputs,
    setTime,
    updateFolders,
    updateHiddenFiles,
    updateMediaFiles,
    updateThumbnailFileList,
} from '../../model/reducers/media-actions'
import {
    HiddenFileInfo,
    MediaFile,
    ThumbnailFile,
} from '../../model/reducers/media-models'
import {
    setCuedFileName,
    setGenerics,
    setLoop,
    setManualStart,
    setMix,
    setOperationMode,
    setSelectedFileName,
    setWeb,
    updateSettings,
} from '../../model/reducers/settings-action'
import { OperationMode, Settings } from '../../model/reducers/settings-models'
import { reduxStore, state } from '../../model/reducers/store'
import mediaService from '../../model/services/media-service'
import settingsService from '../../model/services/settings-service'
import {
    ServerToClient,
    TimeSelectedFilePayload,
} from '../../model/socket-io-constants'

class ClientHandlerService {
    socket: SocketIOClient.Socket

    constructor() {
        this.socket = io()
        this.initConnectionEvents()
        this.initServerEvents()
    }

    private initConnectionEvents(): void {
        this.socket.on('connect', () => {
            reduxStore.dispatch(setConnectionStatus(true))
            console.log('CONNECTED TO CLIPTOOL SERVER')
        })
        this.socket.on('disconnect', () => {
            reduxStore.dispatch(setConnectionStatus(false))
            console.log('LOST CONNECTION TO CLIPTOOL SERVER')
        })
    }

    private initServerEvents(): void {
        this.socket.on(
            ServerToClient.MEDIA_UPDATE,
            (channelIndex: number, payload: MediaFile[]) =>
                this.processMediaUpdateEvent(channelIndex, payload)
        )
        this.socket.on(ServerToClient.FOLDERS_UPDATE, (payload: string[]) =>
            this.processFoldersUpdateEvent(payload)
        )
        this.socket.on(
            ServerToClient.THUMBNAIL_UPDATE,
            (channelIndex: number, payload: ThumbnailFile[]) =>
                this.processThumbnailUpdateEvent(channelIndex, payload)
        )
        this.socket.on(
            ServerToClient.HIDDEN_FILES_UPDATE,
            (hiddenFiles: Record<string, HiddenFileInfo>) =>
                this.processHiddenFilesUpdateEvent(hiddenFiles)
        )
        this.socket.on(
            ServerToClient.TIME_TALLY_UPDATE,
            (data: TimeSelectedFilePayload[]) =>
                this.processTimeTallyUpdateEvent(data)
        )
        this.socket.on(
            ServerToClient.FILE_CUED_UPDATE,
            (channelIndex: number, fileName: string) =>
                this.processFileCuedUpdateEvent(channelIndex, fileName)
        )
        this.socket.on(
            ServerToClient.FILE_SELECTED_UPDATE,
            (channelIndex: number, fileName: string) =>
                this.processFileSelectedUpdateEvent(channelIndex, fileName)
        )
        this.socket.on(
            ServerToClient.LOOP_STATE_UPDATE,
            (channelIndex: number, loop: boolean) =>
                this.processLoopStateUpdateEvent(channelIndex, loop)
        )
        this.socket.on(
            ServerToClient.OPERATION_MODE_UPDATE,
            (channelIndex: number, mode: OperationMode) =>
                this.processOperationStateUpdateEvent(channelIndex, mode)
        )
        this.socket.on(
            ServerToClient.MIX_STATE_UPDATE,
            (channelIndex: number, mix: boolean) =>
                this.processMixStateUpdateEvent(channelIndex, mix)
        )
        this.socket.on(
            ServerToClient.WEB_STATE_UPDATE,
            (channelIndex: number, web: boolean) =>
                this.processWebStateUpdateEvent(channelIndex, web)
        )
        this.socket.on(
            ServerToClient.MANUAL_START_STATE_UPDATE,
            (channelIndex: number, manualStart: boolean) =>
                this.processManualStartStateUpdateEvent(
                    channelIndex,
                    manualStart
                )
        )
        this.socket.on(ServerToClient.SETTINGS_UPDATE, (payload: Settings) =>
            this.processSettingsUpdateEvent(payload)
        )
    }

    private processMediaUpdateEvent(
        channelIndex: number,
        payload: MediaFile[]
    ): void {
        reduxStore.dispatch(updateMediaFiles(channelIndex, payload))
        console.log('Client state :', state)
    }

    private processFoldersUpdateEvent(payload: string[]) {
        reduxStore.dispatch(updateFolders(payload))
    }

    private processThumbnailUpdateEvent(
        channelIndex: number,
        payload: ThumbnailFile[]
    ): void {
        reduxStore.dispatch(updateThumbnailFileList(channelIndex, payload))
    }

    private processHiddenFilesUpdateEvent(
        hiddenFiles: Record<string, HiddenFileInfo>
    ): void {
        reduxStore.dispatch(updateHiddenFiles(hiddenFiles))
    }

    private processTimeTallyUpdateEvent(data: TimeSelectedFilePayload[]): void {
        data.forEach((channel, index) =>
            this.processSingleTimeTallyPayload(channel, index)
        )
    }

    private processSingleTimeTallyPayload(
        channel: TimeSelectedFilePayload,
        index: number
    ): void {
        const oldTime = mediaService.getOutput(state.media, index).time
        if (channel.time[0] !== oldTime[0] || channel.time[1] !== oldTime[1]) {
            if (
                settingsService.getOutputSettings(state.settings, index)
                    .selectedFileName !== channel.selectedFileName
            ) {
                reduxStore.dispatch(
                    setSelectedFileName(index, channel.selectedFileName)
                )
            }
            reduxStore.dispatch(setTime(index, channel.time))
        }
    }

    private processFileCuedUpdateEvent(
        channelIndex: number,
        fileName: string
    ): void {
        reduxStore.dispatch(setCuedFileName(channelIndex, fileName))
    }

    private processFileSelectedUpdateEvent(
        channelIndex: number,
        fileName: string
    ): void {
        reduxStore.dispatch(setSelectedFileName(channelIndex, fileName))
    }

    private processLoopStateUpdateEvent(
        channelIndex: number,
        loop: boolean
    ): void {
        reduxStore.dispatch(setLoop(channelIndex, loop))
    }

    private processOperationStateUpdateEvent(
        channelIndex: number,
        mode: OperationMode
    ): void {
        reduxStore.dispatch(setOperationMode(channelIndex, mode))
    }

    private processMixStateUpdateEvent(
        channelIndex: number,
        mix: boolean
    ): void {
        reduxStore.dispatch(setMix(channelIndex, mix))
    }

    private processWebStateUpdateEvent(
        channelIndex: number,
        web: boolean
    ): void {
        reduxStore.dispatch(setWeb(channelIndex, web))
    }

    private processManualStartStateUpdateEvent(
        channelIndex: number,
        manualStart: boolean
    ): void {
        reduxStore.dispatch(setManualStart(channelIndex, manualStart))
    }

    private processSettingsUpdateEvent(payload: Settings): void {
        reduxStore.dispatch(
            setNumberOfOutputs(payload.ccgConfig.channels.length)
        )
        reduxStore.dispatch(setGenerics(payload.generics))
        reduxStore.dispatch(
            updateSettings(payload.ccgConfig.channels, payload.ccgConfig.path)
        )
    }

    public getSocket(): SocketIOClient.Socket {
        return this.socket
    }
}

const clientHandlerService: ClientHandlerService = new ClientHandlerService()
export default clientHandlerService
