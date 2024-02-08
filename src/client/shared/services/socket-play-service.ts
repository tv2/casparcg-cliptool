import { ClientToServerCommand } from '../../../shared/socket-io-constants'
import { Socket } from 'socket.io-client'

export class SocketPlayService {
    private socket: Socket

    constructor(socket: Socket) {
        this.socket = socket
    }

    public playFile(outputIndex: number, fileName: string): void {
        this.socket.emit(ClientToServerCommand.PGM_PLAY, outputIndex, fileName)
    }

    public loadFile(outputIndex: number, fileName: string): void {
        this.socket.emit(ClientToServerCommand.PGM_LOAD, outputIndex, fileName)
    }
}
