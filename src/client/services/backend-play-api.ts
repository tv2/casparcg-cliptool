import { ClientToServerCommand } from '../../shared/socket-io-constants'
import { SocketService } from './socket-service'

export class BackendPlayApi {
    static readonly instance = new BackendPlayApi(
        SocketService.instance.getSocket()
    )
    private socket: SocketIOClient.Socket

    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket
    }

    public emitPlayFile(outputIndex: number, fileName: string) {
        this.socket.emit(ClientToServerCommand.PGM_PLAY, outputIndex, fileName)
    }

    public emitLoadFile(outputIndex: number, fileName: string) {
        this.socket.emit(ClientToServerCommand.PGM_LOAD, outputIndex, fileName)
    }
}
