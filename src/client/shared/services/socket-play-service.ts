import { ClientToServerCommand } from '../../../shared/socket-io-constants'

export class SocketPlayService {
    private socket: SocketIOClient.Socket

    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket
    }

    public playFile(outputIndex: number, fileName: string): void {
        this.socket.emit(ClientToServerCommand.PGM_PLAY, outputIndex, fileName)
    }

    public loadFile(outputIndex: number, fileName: string): void {
        this.socket.emit(ClientToServerCommand.PGM_LOAD, outputIndex, fileName)
    }
}
