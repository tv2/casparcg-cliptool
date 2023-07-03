import { AppNavigation } from '../models/app-navigation-models'

export class AppNavigationService {
    public getActiveTabIndex(navigationState: AppNavigation): number {
        return navigationState.activeTabIndex
    }
}
