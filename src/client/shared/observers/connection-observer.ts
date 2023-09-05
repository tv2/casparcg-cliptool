import { setConnectionStatus } from '../../../shared/actions/app-navigation-action'
import { reduxStore } from '../../../shared/store'

export class ConnectionObserver {
    private socket: SocketIOClient.Socket

    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket
        this.initConnectionEventsListeners()
    }

    private initConnectionEventsListeners(): void {
        this.socket.on('connect', () => {
            reduxStore.dispatch(setConnectionStatus(true))
            console.log('CONNECTED TO CLIPTOOL SERVER')
        })
        this.socket.on('disconnect', () => {
            reduxStore.dispatch(setConnectionStatus(false))
            console.log('LOST CONNECTION TO CLIPTOOL SERVER')
        })
        this.socket.on('error', (error: string) => {
            const splitError = error.split('|')
            if (splitError.length !== 2) {
                console.log(
                    'Received error from backend without expected layout:',
                    error
                )
                return
            }
            alert(splitError[0])
        })
    }
}
