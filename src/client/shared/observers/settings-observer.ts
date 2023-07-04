import { ServerToClientCommand } from '../../../shared/socket-io-constants'
import { reduxStore } from '../../../shared/store'
import { Settings } from '../../../shared/models/settings-models'
import { setNumberOfOutputs } from '../../../shared/actions/media-actions'
import {
    setGenerics,
    setLoop,
    setManualStart,
    setMix,
    setWeb,
    updateSettings,
} from '../../../shared/actions/settings-action'

export class SettingsObserver {
    private socket: SocketIOClient.Socket

    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket
        this.initSettingsEventsListeners()
    }

    private initSettingsEventsListeners(): void {
        this.socket.on(
            ServerToClientCommand.LOOP_STATE_UPDATE,
            this.processLoopStateUpdateEvent.bind(this)
        )
        this.socket.on(
            ServerToClientCommand.MIX_STATE_UPDATE,
            this.processMixStateUpdateEvent.bind(this)
        )
        this.socket.on(
            ServerToClientCommand.WEB_STATE_UPDATE,
            this.processWebStateUpdateEvent.bind(this)
        )
        this.socket.on(
            ServerToClientCommand.MANUAL_START_STATE_UPDATE,
            this.processManualStartStateUpdateEvent.bind(this)
        )
        this.socket.on(
            ServerToClientCommand.SETTINGS_UPDATE,
            this.processSettingsUpdateEvent.bind(this)
        )
    }

    private processLoopStateUpdateEvent(
        channelIndex: number,
        loop: boolean
    ): void {
        reduxStore.dispatch(setLoop(channelIndex, loop))
    }

    private processMixStateUpdateEvent(
        channelIndex: number,
        mix: boolean
    ): void {
        reduxStore.dispatch(setMix(channelIndex, mix))
    }

    private processWebStateUpdateEvent(
        channelIndex: number,
        web: boolean
    ): void {
        reduxStore.dispatch(setWeb(channelIndex, web))
    }

    private processManualStartStateUpdateEvent(
        channelIndex: number,
        manualStart: boolean
    ): void {
        reduxStore.dispatch(setManualStart(channelIndex, manualStart))
    }

    private processSettingsUpdateEvent(payload: Settings): void {
        reduxStore.dispatch(
            setNumberOfOutputs(payload.ccgConfig.channels.length)
        )
        reduxStore.dispatch(setGenerics(payload.generics))
        reduxStore.dispatch(
            updateSettings(payload.ccgConfig.channels, payload.ccgConfig.path)
        )
    }
}
