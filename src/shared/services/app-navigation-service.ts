import { AppNavigation } from '../models/app-navigation-models'

class AppNavigationService {
    public getActiveTabIndex(navigationState: AppNavigation): number {
        return navigationState.activeTabIndex
    }
}

const appNavigationService: AppNavigationService = new AppNavigationService()
export default appNavigationService
