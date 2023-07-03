import { updateHiddenFiles } from '../../shared/actions/media-actions'
import { setOperationMode } from '../../shared/actions/settings-action'
import { HiddenFiles } from '../../shared/models/media-models'
import { OperationMode } from '../../shared/models/settings-models'
import { ServerToClientCommand } from '../../shared/socket-io-constants'
import { reduxStore } from '../../shared/store'

export class OperationObserver {
    private socket: SocketIOClient.Socket

    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket
        this.initOperationsEventListeners()
    }

    private initOperationsEventListeners() {
        this.socket.on(
            ServerToClientCommand.HIDDEN_FILES_UPDATE,
            this.processHiddenFilesUpdateEvent.bind(this)
        )
        this.socket.on(
            ServerToClientCommand.OPERATION_MODE_UPDATE,
            this.processOperationStateUpdateEvent.bind(this)
        )
    }

    private processHiddenFilesUpdateEvent(hiddenFiles: HiddenFiles): void {
        reduxStore.dispatch(updateHiddenFiles(hiddenFiles))
    }

    private processOperationStateUpdateEvent(
        channelIndex: number,
        mode: OperationMode
    ): void {
        reduxStore.dispatch(setOperationMode(channelIndex, mode))
    }
}
