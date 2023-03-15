import { reduxState } from '../reducers/store'

class AppNavigationService {
    public getActiveTab(): number {
        return reduxState.appNav[0].activeTab
    }
}

const appNavigationService: AppNavigationService = new AppNavigationService()
export default appNavigationService
