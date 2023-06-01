import { AppNavigation } from '../reducers/app-navigation-reducer'

class AppNavigationService {
    public getActiveTabIndex(navigationState: AppNavigation): number {
        return navigationState.activeTabIndex
    }
}

const appNavigationService: AppNavigationService = new AppNavigationService()
export default appNavigationService
