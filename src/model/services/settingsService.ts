import { GenericSettings, OutputSettings } from '../reducers/settingsModels'
import { reduxState, ReduxStateType } from '../reducers/store'
import {
    defaultOutputSettingsState,
    NewGenericSettings,
} from '../schemas/settingsSchema'
import appNavigationService from './appNavigationService'

class SettingsService {
    fallBackDefaultSettings: GenericSettings

    constructor() {
        this.fallBackDefaultSettings = {
            transitionTime: 16,
            ccgIp: '0.0.0.0',
            ccgAmcpPort: 5250,
            ccgDefaultLayer: 5253,
            ccgOscPort: 10,
            outputs: Array(8).fill(defaultOutputSettingsState),
        }
    }

    getOutputSettings(
        state: ReduxStateType = reduxState,
        channelIndex: number = -1
    ): OutputSettings {
        const activeTab: number =
            channelIndex === -1
                ? appNavigationService.getActiveTab()
                : channelIndex
        return state.settings.generics.outputs[activeTab]
    }

    getGenericSettings(state: ReduxStateType = reduxState): GenericSettings {
        return state.settings.generics
    }

    getDefaultGenericSettings(): GenericSettings {
        const parsed = NewGenericSettings.safeParse({})
        if (parsed.success) {
            return parsed.data as GenericSettings
        }
        return this.fallBackDefaultSettings
    }
}

const settingsService: SettingsService = new SettingsService()
export default settingsService
