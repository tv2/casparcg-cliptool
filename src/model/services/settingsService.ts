import { ReduxStateType } from '../reducers/indexReducer'
import { GenericSettings, OutputSettings } from '../reducers/settingsModels'
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
        console.log('Method', this.getDefaultGenericSettings)
    }

    getOutputSettings(
        state: ReduxStateType,
        channelIndex: number = -1
    ): OutputSettings {
        const activeTab: number =
            channelIndex === -1
                ? appNavigationService.getActiveTab()
                : channelIndex
        return state.settings.generics.outputs[activeTab]
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
