import { GenericSettings } from '../../../shared/models/settings-models'
import { ClientToServerCommand } from '../../../shared/socket-io-constants'
import { Socket } from 'socket.io-client'

export class SocketSettingsService {
    private socket: Socket

    constructor(socket: Socket) {
        this.socket = socket
    }

    public setLoopState(outputIndex: number, state: boolean) {
        this.socket.emit(
            ClientToServerCommand.SET_LOOP_STATE,
            outputIndex,
            state,
        )
    }

    public setMixState(outputIndex: number, state: boolean) {
        this.socket.emit(
            ClientToServerCommand.SET_MIX_STATE,
            outputIndex,
            state,
        )
    }

    public setWebState(outputIndex: number, state: boolean) {
        this.socket.emit(
            ClientToServerCommand.SET_WEB_STATE,
            outputIndex,
            state,
        )
    }

    public setManualStartState(outputIndex: number, state: boolean) {
        this.socket.emit(
            ClientToServerCommand.SET_MANUAL_START_STATE,
            outputIndex,
            state,
        )
    }

    public setGenericSettings(settings: GenericSettings) {
        this.socket.emit(ClientToServerCommand.SET_GENERICS, settings)
    }
}
