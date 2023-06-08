import io from 'socket.io-client'

class SocketService {
    private socket: SocketIOClient.Socket

    constructor() {
        this.socket = io()
    }

    public getSocket(): SocketIOClient.Socket {
        return this.socket
    }
}

const socketService: SocketService = new SocketService()
export default socketService
