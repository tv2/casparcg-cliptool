import { OutputSettings } from '../../model/reducers/settingsReducer'
import { reduxState, ReduxStateType } from '../../model/reducers/store'
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
