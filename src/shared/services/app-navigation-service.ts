import { AppNavigationState } from '../models/app-navigation-models'

export class AppNavigationService {
    public getActiveTabIndex(navigationState: AppNavigationState): number {
        return navigationState.activeTabIndex
    }
}
