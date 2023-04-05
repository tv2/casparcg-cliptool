import _ from 'lodash'
import { TOGGLE_SHOW_SETTINGS } from '../../model/reducers/app-navigation-action'
import {
    CasparcgSettings,
    GenericSettings,
    OutputSettings,
} from '../../model/reducers/settings-models'
import { reduxStore, state } from '../../model/reducers/store'
import settingsService from '../../model/services/settings-service'
import { ClientToServer } from '../../model/socket-io-constants'
import { socket } from '../util/socketClientHandlers'

class ChangingSettingsService {
    private temporarySettings: GenericSettings | undefined
    private setTemporarySettings:
        | React.Dispatch<React.SetStateAction<GenericSettings | undefined>>
        | undefined

    public initStateHandler(
        init: GenericSettings | undefined,
        setInit:
            | React.Dispatch<React.SetStateAction<GenericSettings | undefined>>
            | undefined
    ): void {
        this.temporarySettings = init
        this.setTemporarySettings = setInit
    }

    public resetStateHandler(): void {
        this.temporarySettings = undefined
        this.setTemporarySettings = undefined
    }

    /**
     * To be used from an 'useEffect' listening for changes to the state object that was supplied to the first argument of the {@link ChangingSettingsService.initStateHandler} function.
     *
     * @param settings - The new value of the state value.
     */
    public saveTemporarySettingChanges(
        settings: GenericSettings | undefined
    ): void {
        this.temporarySettings = settings
    }

    public saveTemporaryCcgSettingChanges(ccgSettings: CasparcgSettings): void {
        if (!this.temporarySettings) {
            return
        }
        this.updateStateTemporarySettings({
            ...this.temporarySettings,
            ccgSettings,
        })
    }

    private updateStateTemporarySettings(
        settings: GenericSettings | undefined
    ): void {
        if (this.setTemporarySettings) {
            this.setTemporarySettings(settings)
        }
    }

    public saveTemporaryOutputSettingsChange(
        outputSettings: OutputSettings[]
    ): void {
        if (!this.temporarySettings) {
            return
        }
        this.updateStateTemporarySettings({
            ...this.temporarySettings,
            outputSettings,
        })
    }

    public saveTemporaryOutputSettingChange(
        output: OutputSettings,
        index: number
    ): void {
        if (!this.temporarySettings) {
            return
        }
        const outputsSettingsCopy = [...this.temporarySettings.outputSettings]
        outputsSettingsCopy[index] = output
        this.saveTemporaryOutputSettingsChange(outputsSettingsCopy)
    }

    public saveClone(settings: GenericSettings): void {
        this.updateStateTemporarySettings(this.deepClone(settings))
    }

    private deepClone<T>(value: T): T {
        return JSON.parse(JSON.stringify(value))
    }

    public saveSettings(): void {
        if (
            this.temporarySettings &&
            this.hasChanges() &&
            window.confirm('Changes have been made, do you want to save them?')
        ) {
            socket.emit(ClientToServer.SET_GENERICS, this.temporarySettings)
            this.toggleSettingsPage()
        }
    }

    public discardSettings(): void {
        if (
            !this.temporarySettings ||
            (this.temporarySettings &&
                this.hasChanges() &&
                !window.confirm(
                    'Changes have been made, are you sure you want to discard them?'
                ))
        ) {
            return
        }
        this.updateStateTemporarySettings(undefined)
        this.toggleSettingsPage()
    }

    public hasChanges(): boolean {
        return !_.isEqual(
            this.temporarySettings,
            settingsService.getGenericSettings(state.settings)
        )
    }

    public toggleSettingsPage(): void {
        reduxStore.dispatch({
            type: TOGGLE_SHOW_SETTINGS,
        })
    }
}

const changingSettingsService: ChangingSettingsService =
    new ChangingSettingsService()
export default changingSettingsService
