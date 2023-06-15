import { AppNavigation } from '../models/app-navigation-models'

export class AppNavigationService {
    static readonly instance = new AppNavigationService()
    public getActiveTabIndex(navigationState: AppNavigation): number {
        return navigationState.activeTabIndex
    }
}
