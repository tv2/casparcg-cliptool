import { reduxState, reduxStore } from '../../model/reducers/store'
import { logger } from '../utils/logger'
import * as IO from '../../model/SocketIoConstants'

import { socketServer } from './expressHandler'
import { playMedia } from '../utils/CcgLoadPlay'
import { setLoop, setMix, setAutoplay } from '../../model/reducers/mediaActions'

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
        .on(IO.GET_SETTINGS, () => {
            socketServer.emit(IO.SETTINGS_UPDATE, reduxState.settings[0])
        })
        .on(IO.PGM_PLAY, (channelIndex: number, fileName: string) => {
            playMedia(channelIndex, 9, fileName)
            console.log(
                'Play out :',
                fileName,
                ' On ChannelIndex : ',
                channelIndex
            )
        })
        .on(IO.SET_LOOP_STATE, (channelIndex: number, state: boolean) => {
            reduxStore.dispatch(setLoop(channelIndex, state))
            socketServer.emit(
                IO.LOOP_STATEUPDATE,
                reduxState.media[0].loopState
            )
        })
        .on(IO.SET_AUTOPLAY_STATE, (channelIndex: number, state: boolean) => {
            reduxStore.dispatch(setAutoplay(channelIndex, state))
            socketServer.emit(
                IO.AUTOPLAY_STATE_UPDATE,
                reduxState.media[0].autoplayState
            )
        })
        .on(IO.SET_MIX_STATE, (channelIndex: number, state: boolean) => {
            reduxStore.dispatch(setMix(channelIndex, state))
            socketServer.emit(IO.MIX_STATE_UPDATE, reduxState.media[0].mixState)
        })
}
