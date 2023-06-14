import { GenericSettings } from '../../shared/models/settings-models'
import { ClientToServerCommand } from '../../shared/socket-io-constants'
import socketService from './socket-service'

class BackendSettingsApi {
    private socket: SocketIOClient.Socket

    constructor() {
        this.socket = socketService.getSocket()
    }

    public emitSetLoopState(outputIndex: number, state: boolean) {
        this.socket.emit(
            ClientToServerCommand.SET_LOOP_STATE,
            outputIndex,
            state
        )
    }

    public emitSetMixState(outputIndex: number, state: boolean) {
        this.socket.emit(
            ClientToServerCommand.SET_MIX_STATE,
            outputIndex,
            state
        )
    }

    public emitSetWebState(outputIndex: number, state: boolean) {
        this.socket.emit(
            ClientToServerCommand.SET_WEB_STATE,
            outputIndex,
            state
        )
    }

    public emitSetManualStartState(outputIndex: number, state: boolean) {
        this.socket.emit(
            ClientToServerCommand.SET_MANUAL_START_STATE,
            outputIndex,
            state
        )
    }

    public emitSetGenericSettings(settings: GenericSettings) {
        this.socket.emit(ClientToServerCommand.SET_GENERICS, settings)
    }
}

const backendSettingApi: BackendSettingsApi = new BackendSettingsApi()
export default backendSettingApi