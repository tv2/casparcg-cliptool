import {
    GenericSettings,
    OperationMode,
} from '../../model/reducers/settings-models'
import { ClientToServer } from '../../model/socket-io-constants'
import clientHandlerService from './client-handler-service'

class SocketService {
    socket: SocketIOClient.Socket

    constructor() {
        this.socket = clientHandlerService.getSocket()
    }

    public emitSetOperationModeToControl(outputIndex: number) {
        this.socket.emit(
            ClientToServer.SET_OPERATION_MODE,
            outputIndex,
            OperationMode.CONTROL
        )
    }

    public emitSetOperationModeToEditVisibility(outputIndex: number) {
        this.socket.emit(
            ClientToServer.SET_OPERATION_MODE,
            outputIndex,
            OperationMode.EDIT_VISIBILITY
        )
    }

    public emitSetLoopState(outputIndex: number, state: boolean) {
        this.socket.emit(ClientToServer.SET_LOOP_STATE, outputIndex, state)
    }

    public emitSetMixState(outputIndex: number, state: boolean) {
        this.socket.emit(ClientToServer.SET_MIX_STATE, outputIndex, state)
    }

    public emitSetWebState(outputIndex: number, state: boolean) {
        this.socket.emit(ClientToServer.SET_WEB_STATE, outputIndex, state)
    }

    public emitSetManualStartState(outputIndex: number, state: boolean) {
        this.socket.emit(
            ClientToServer.SET_MANUAL_START_STATE,
            outputIndex,
            state
        )
    }

    public emitPlayFile(outputIndex: number, fileName: string) {
        this.socket.emit(ClientToServer.PGM_PLAY, outputIndex, fileName)
    }

    public emitLoadFile(outputIndex: number, fileName: string) {
        this.socket.emit(ClientToServer.PGM_LOAD, outputIndex, fileName)
    }

    public emitToggleThumbnailVisibility(
        fileOriginOutputIndex: number,
        fileName: string
    ) {
        this.socket.emit(
            ClientToServer.TOGGLE_THUMBNAIL_VISIBILITY,
            fileOriginOutputIndex,
            fileName
        )
    }

    public emitRestartServer() {
        this.socket.emit(ClientToServer.RESTART_SERVER)
    }

    public emitSetGenericSettings(settings: GenericSettings) {
        this.socket.emit(ClientToServer.SET_GENERICS, settings)
    }
}

const socketService: SocketService = new SocketService()
export default socketService
