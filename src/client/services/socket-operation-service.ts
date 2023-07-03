import { OperationMode } from '../../shared/models/settings-models'
import { ClientToServerCommand } from '../../shared/socket-io-constants'

export class SocketOperationService {
    private socket: SocketIOClient.Socket

    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket
    }

    public setOperationModeToControl(outputIndex: number) {
        this.socket.emit(
            ClientToServerCommand.SET_OPERATION_MODE,
            outputIndex,
            OperationMode.CONTROL
        )
    }

    public setOperationModeToEditVisibility(outputIndex: number) {
        this.socket.emit(
            ClientToServerCommand.SET_OPERATION_MODE,
            outputIndex,
            OperationMode.EDIT_VISIBILITY
        )
    }

    public toggleThumbnailVisibility(
        fileOriginOutputIndex: number,
        fileName: string
    ) {
        this.socket.emit(
            ClientToServerCommand.TOGGLE_THUMBNAIL_VISIBILITY,
            fileOriginOutputIndex,
            fileName
        )
    }

    public restartServer() {
        this.socket.emit(ClientToServerCommand.RESTART_SERVER)
    }
}
