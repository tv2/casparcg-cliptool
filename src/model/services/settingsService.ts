import { OutputSettings } from '../reducers/settingsModels'
import { reduxState, ReduxStateType } from '../reducers/store'
import appNavigationService from './appNavigationService'

class SettingsService {
    getOutputSettings(
        state: ReduxStateType = reduxState,
        channelIndex: number = -1
    ): OutputSettings {
        const activeTab: number =
            channelIndex === -1
                ? appNavigationService.getActiveTab()
                : channelIndex
        return state.settings[0].generics.outputs[activeTab]
    }
}

const settingsService: SettingsService = new SettingsService()
export default settingsService
