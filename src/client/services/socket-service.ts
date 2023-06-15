import io from 'socket.io-client'

export class SocketService {
    static readonly instance = new SocketService()
    private socket: SocketIOClient.Socket

    constructor() {
        this.socket = io()
    }

    public getSocket(): SocketIOClient.Socket {
        return this.socket
    }
}
