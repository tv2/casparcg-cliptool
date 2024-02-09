import { ConnectionObserver } from '../observers/connection-observer'
import { OperationObserver } from '../observers/operation-observer'
import { PlayObserver } from '../observers/play-observer'
import { SettingsObserver } from '../observers/settings-observer'
import { SocketService } from './socket-service'
import { Socket } from 'socket.io-client'

export class ObserverService {
    constructor() {
        const socket = SocketService.instance.getSocket()
        this.startObservers(socket)
    }

    private startObservers(socket: Socket): void {
        new ConnectionObserver(socket)
        new PlayObserver(socket)
        new OperationObserver(socket)
        new SettingsObserver(socket)

        console.log('Socket Initialized', socket)
        console.log('Observers: Monitoring messages from socket...')
    }
}
