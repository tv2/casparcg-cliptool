import { AppNavigation } from '../reducers/app-navigation-reducer'
class AppNavigationService {
    public getActiveTab(navigationState: AppNavigation): number {
        return navigationState.activeTab
    }
}

const appNavigationService: AppNavigationService = new AppNavigationService()
export default appNavigationService
