import { ReduxStateType } from '../reducers/indexReducer'
import { reduxState } from '../reducers/store'

class AppNavigationService {
    public getActiveTab(state: ReduxStateType = reduxState): number {
        return state.appNav.activeTab
    }
}

const appNavigationService: AppNavigationService = new AppNavigationService()
export default appNavigationService
