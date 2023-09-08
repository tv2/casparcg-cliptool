import { setConnectionStatus } from '../../../shared/actions/app-navigation-action'
import { reduxStore } from '../../../shared/store'
import { ErrorEvent } from '../../../shared/models/error-models'

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
        this.socket.on('error', (errorEvent: ErrorEvent) => {
            console.log('Error occurred in backend', errorEvent.errorMessage)
            if (!errorEvent.shouldNotify) {
                return
            }
            alert(errorEvent.message)
        })
    }
}
