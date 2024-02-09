import io from 'socket.io-client'
import { Socket } from 'socket.io-client'

export class SocketService {
    static readonly instance = new SocketService()
    private readonly socket: Socket

    private constructor() {
        this.socket = io()
    }

    public getSocket(): Socket {
        return this.socket
    }
}
