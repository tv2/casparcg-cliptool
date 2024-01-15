import {
    setTime,
    updateFolders,
    updateMediaFiles,
    updateThumbnailFileList,
} from '../../../shared/actions/media-actions'
import {
    setCuedFileName,
    setSelectedFileName,
} from '../../../shared/actions/settings-action'
import { MediaFile, ThumbnailFile } from '../../../shared/models/media-models'
import { ReduxMediaService } from '../../../shared/services/redux-media-service'
import { ReduxSettingsService } from '../../../shared/services/redux-settings-service'
import {
    ServerToClientCommand,
    TimeSelectedFilePayload,
} from '../../../shared/socket-io-constants'
import { reduxStore, state } from '../../../shared/store'

export class PlayObserver {
    private socket: SocketIOClient.Socket

    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket
        this.initPlayEventListeners()
    }

    private initPlayEventListeners(): void {
        this.socket.on(
            ServerToClientCommand.TIME_TALLY_UPDATE,
            this.processTimeTallyUpdateEvent.bind(this)
        )
        this.socket.on(
            ServerToClientCommand.FILE_CUED_UPDATE,
            this.processFileCuedUpdateEvent.bind(this)
        )
        this.socket.on(
            ServerToClientCommand.FILE_SELECTED_UPDATE,
            this.processFileSelectedUpdateEvent.bind(this)
        )
        this.socket.on(
            ServerToClientCommand.MEDIA_UPDATE,
            this.processMediaUpdateEvent.bind(this)
        )
        this.socket.on(
            ServerToClientCommand.FOLDERS_UPDATE,
            this.processFoldersUpdateEvent.bind(this)
        )
        this.socket.on(
            ServerToClientCommand.THUMBNAIL_UPDATE,
            this.processThumbnailUpdateEvent.bind(this)
        )
    }

    private processTimeTallyUpdateEvent(
        payloads: TimeSelectedFilePayload[]
    ): void {
        payloads.forEach((channel, index) =>
            this.processSingleTimeTallyPayload(channel, index)
        )
    }

    private processSingleTimeTallyPayload(
        channel: TimeSelectedFilePayload,
        index: number
    ): void {
        const reduxMediaService = new ReduxMediaService()
        const reduxSettingsService = new ReduxSettingsService()

        const oldTime = reduxMediaService.getOutput(state.media, index).time
        if (!this.hasTimeChanged(oldTime, channel.time)) {
            return
        }

        if (
            reduxSettingsService.getOutputState(state.settings, index)
                .selectedFileName !== channel.selectedFileName
        ) {
            reduxStore.dispatch(
                setSelectedFileName(index, channel.selectedFileName)
            )
        }
        reduxStore.dispatch(setTime(index, channel.time))
    }

    private hasTimeChanged(
        oldtimeRange: [number, number],
        newTimeRange: [number, number]
    ): boolean {
        return (
            newTimeRange[0] !== oldtimeRange[0] ||
            newTimeRange[1] !== oldtimeRange[1]
        )
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

    private processMediaUpdateEvent(
        channelIndex: number,
        payload: MediaFile[]
    ): void {
        reduxStore.dispatch(updateMediaFiles(channelIndex, payload))
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
}
