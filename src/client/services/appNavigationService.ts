import { reduxState } from '../../model/reducers/store'

class AppNavigationService {
    public getActiveTab(): number {
        return reduxState.appNav[0].activeTab
    }
}

const appNavigationService: AppNavigationService = new AppNavigationService()
export default appNavigationService
