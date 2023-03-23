import { ReduxStateType } from '../reducers/indexReducer'
import { GenericSettings, OutputSettings } from '../reducers/settingsModels'
import {
    defaultOutputSettingsState,
    NewGenericSettings,
} from '../schemas/new-settings-schema'
import appNavigationService from './appNavigationService'

class SettingsService {
    private fallBackDefaultSettings: GenericSettings

    constructor() {
        this.fallBackDefaultSettings = {
            ccgSettings: {
                transitionTime: 16,
                ip: '0.0.0.0',
                amcpPort: 5250,
                defaultLayer: 5253,
                oscPort: 10,
            },
            outputSettings: Array(8).fill(defaultOutputSettingsState),
        }
    }

    getOutputSettings(
        state: ReduxStateType,
        channelIndex: number = -1
    ): OutputSettings {
        const activeTab: number =
            channelIndex === -1
                ? appNavigationService.getActiveTab()
                : channelIndex
        return state.settings.generics.outputSettings[activeTab]
    }

    getGenericSettings(state: ReduxStateType): GenericSettings {
        return state.settings.generics
    }

    getDefaultGenericSettings(): GenericSettings {
        const parsed = NewGenericSettings.safeParse({})
        return parsed.success
            ? (parsed.data as GenericSettings)
            : this.fallBackDefaultSettings
    }
}

const settingsService: SettingsService = new SettingsService()
export default settingsService
