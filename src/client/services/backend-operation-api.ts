import { OperationMode } from '../../shared/models/settings-models'
import { ClientToServerCommand } from '../../shared/socket-io-constants'
import socketService from './socket-service'

class BackendOperationApi {
    private socket: SocketIOClient.Socket

    constructor() {
        this.socket = socketService.getSocket()
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

const backendOperationApi: BackendOperationApi = new BackendOperationApi()
export default backendOperationApi