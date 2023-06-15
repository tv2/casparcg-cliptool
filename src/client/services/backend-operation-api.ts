import { OperationMode } from '../../shared/models/settings-models'
import { ClientToServerCommand } from '../../shared/socket-io-constants'
import { SocketService } from './socket-service'

export class BackendOperationApi {
    static readonly instance = new BackendOperationApi(
        SocketService.instance.getSocket()
    )
    private socket: SocketIOClient.Socket

    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket
    }

    public emitSetOperationModeToControl(outputIndex: number) {
        this.socket.emit(
            ClientToServerCommand.SET_OPERATION_MODE,
            outputIndex,
            OperationMode.CONTROL
        )
    }

    public emitSetOperationModeToEditVisibility(outputIndex: number) {
        this.socket.emit(
            ClientToServerCommand.SET_OPERATION_MODE,
            outputIndex,
            OperationMode.EDIT_VISIBILITY
        )
    }

    public emitToggleThumbnailVisibility(
        fileOriginOutputIndex: number,
        fileName: string
    ) {
        this.socket.emit(
            ClientToServerCommand.TOGGLE_THUMBNAIL_VISIBILITY,
            fileOriginOutputIndex,
            fileName
        )
    }

    public emitRestartServer() {
        this.socket.emit(ClientToServerCommand.RESTART_SERVER)
    }
}
