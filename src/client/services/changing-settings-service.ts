import _ from 'lodash'
import { toggleSettingsVisibility } from '../../shared/actions/app-navigation-action'
import backendSettingApi from './backend-settings-api'
import {
    CasparcgSettings,
    GenericSettings,
    OutputSettings,
} from '../../shared/models/settings-models'
import settingsService from '../../shared/services/settings-service'
import { reduxStore, state } from '../../shared/store'

class ChangingSettingsService {
    private temporarySettings: GenericSettings | undefined
    private hasChanges: boolean
    private setTemporarySettings:
        | React.Dispatch<React.SetStateAction<GenericSettings | undefined>>
        | undefined

    constructor() {
        this.hasChanges = false
        this.updateHasChanges()
    }

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
     * To be used from an 'useEffect' listening for changes to the state object that was supplied to the first argument of the {@link changingSettingsService.initStateHandler | Init function}.
     *
     * @param settings - The new value of the state value.
     */
    public saveTemporarySettingChanges(
        settings: GenericSettings | undefined
    ): void {
        this.temporarySettings = settings
    }

    private updateHasChanges(): void {
        this.hasChanges = !_.isEqual(
            this.temporarySettings,
            settingsService.getGenericSettings(state.settings)
        )
    }

    public saveTemporaryCcgSettingChanges(ccgSettings: CasparcgSettings): void {
        if (!this.temporarySettings) {
            return
        }
        this.updateTemporarySettings({
            ...this.temporarySettings,
            ccgSettings,
        })
    }

    private updateTemporarySettings(
        settings: GenericSettings | undefined
    ): void {
        if (this.setTemporarySettings) {
            this.setTemporarySettings(settings)
            this.temporarySettings = settings
            this.updateHasChanges()
        }
    }

    public saveTemporaryOutputSettingsChange(
        outputSettings: OutputSettings[]
    ): void {
        if (!this.temporarySettings) {
            return
        }
        this.updateTemporarySettings({
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
        this.updateTemporarySettings(this.deepClone(settings))
    }

    private deepClone<T>(value: T): T {
        return JSON.parse(JSON.stringify(value))
    }

    public saveSettings(): void {
        if (
            this.temporarySettings &&
            this.getHasChanges() &&
            window.confirm('Changes have been made, do you want to save them?')
        ) {
            backendSettingApi.emitSetGenericSettings(this.temporarySettings)
            this.toggleSettingsPage()
        }
    }

    public discardSettings(): void {
        if (
            !this.temporarySettings ||
            (this.temporarySettings &&
                this.getHasChanges() &&
                !window.confirm(
                    'Changes have been made, are you sure you want to discard them?'
                ))
        ) {
            return
        }
        this.updateTemporarySettings(undefined)
        this.toggleSettingsPage()
    }

    public getHasChanges(): boolean {
        return this.hasChanges
    }

    public toggleSettingsPage(): void {
        reduxStore.dispatch(toggleSettingsVisibility())
    }
}

const changingSettingsService: ChangingSettingsService =
    new ChangingSettingsService()
export default changingSettingsService
