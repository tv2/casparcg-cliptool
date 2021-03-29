import { reduxState } from '../../model/reducers/store'
import { logger } from '../utils/logger'

import { socketServer } from './expressHandler'

export function socketIoHandlers(socket: any) {
    logger.info('SETTING UP SOCKET IO MAIN HANDLERS', {})

    // get-store get-settings and get-mixerprotocol will be replaces with
    // serverside Redux middleware emitter when moved to Socket IO:
    socket
        .on('GET_STORE', () => {
            logger.info(
                'Settings initial store on :' + String(socket.client.id),
                {}
            )
            socketServer.emit('SEND_STORE', reduxState)
        })
        .on('GET_SETTINGS', () => {
            socketServer.emit('SEND_SETTINGS', reduxState.settings[0])
        })
}
