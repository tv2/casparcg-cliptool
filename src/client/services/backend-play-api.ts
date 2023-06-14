import { ClientToServerCommand } from '../../shared/socket-io-constants'
import socketService from './socket-service'

class BackendPlayApi {
    private socket: SocketIOClient.Socket

    constructor() {
        this.socket = socketService.getSocket()
    }

    public emitPlayFile(outputIndex: number, fileName: string) {
        this.socket.emit(ClientToServerCommand.PGM_PLAY, outputIndex, fileName)
    }

    public emitLoadFile(outputIndex: number, fileName: string) {
        this.socket.emit(ClientToServerCommand.PGM_LOAD, outputIndex, fileName)
    }
}

const backendPlayApi: BackendPlayApi = new BackendPlayApi()
export default backendPlayApi