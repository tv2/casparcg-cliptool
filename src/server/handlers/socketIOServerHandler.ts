import { reduxState, reduxStore } from '../../model/reducers/store'
import { logger } from '../utils/logger'
import * as IO from '../../model/SocketIoConstants'

import { socketServer } from './expressHandler'
import { mixMedia, playMedia, loadMedia } from '../utils/CcgLoadPlay'
import {
    setLoop,
    setMix,
    setManualStart,
} from '../../model/reducers/mediaActions'
import { setGenerics } from '../../model/reducers/settingsAction'
import { IGenericSettings } from '../../model/reducers/settingsReducer'
import { saveSettings } from '../utils/SettingsStorage'

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
            reduxState.media[0].tallyFile.forEach(
                (tallyFile: string, index: number) => {
                    socketServer.emit(IO.TALLY_UPDATE, index, tallyFile)
                }
            )
        })
        .on(IO.PGM_PLAY, (channelIndex: number, fileName: string) => {
            if (!reduxState.media[0].mixState[channelIndex]) {
                playMedia(channelIndex, 9, fileName)
            } else {
                mixMedia(channelIndex, 9, fileName)
            }
            logger.info(
                'Play out :' + fileName + ' On ChannelIndex : ' + channelIndex
            )
        })
        .on(IO.PGM_LOAD, (channelIndex: number, fileName: string) => {
            loadMedia(channelIndex, 9, fileName)
            logger.info(
                'Load Media :' + fileName + ' On ChannelIndex : ' + channelIndex
            )
        })
        .on(IO.SET_LOOP_STATE, (channelIndex: number, state: boolean) => {
            reduxStore.dispatch(setLoop(channelIndex, state))
            socketServer.emit(
                IO.LOOP_STATEUPDATE,
                reduxState.media[0].loopState
            )
        })
        .on(
            IO.SET_MANUAL_START_STATE,
            (channelIndex: number, state: boolean) => {
                reduxStore.dispatch(setManualStart(channelIndex, state))
                socketServer.emit(
                    IO.MANUAL_START_STATE_UPDATE,
                    reduxState.media[0].manualstartState
                )
            }
        )
        .on(IO.SET_MIX_STATE, (channelIndex: number, state: boolean) => {
            reduxStore.dispatch(setMix(channelIndex, state))
            socketServer.emit(IO.MIX_STATE_UPDATE, reduxState.media[0].mixState)
        })
        .on(IO.SET_GENERICS, (generics: IGenericSettings) => {
            console.log('Updating and storing Generic Settings Serverside')
            reduxStore.dispatch(setGenerics(generics))
            saveSettings()
            socketServer.emit(IO.SETTINGS_UPDATE, reduxState.settings[0])
        })
}
