import * as AppNav from './app-navigation-action'
export interface AppNavigation {
    isConnected: boolean
    activeTab: number
    isSettingsOpen: boolean
}

function defaultAppNavigationReducerState(): AppNavigation {
    return {
        isConnected: false,
        activeTab: 0,
        isSettingsOpen: false,
    }
}

export function appNavigation(
    state: AppNavigation = defaultAppNavigationReducerState(),
    action: any
): AppNavigation {
    let nextState: AppNavigation = { ...state }

    switch (action.type) {
        case AppNav.SET_ACTIVE_TAB:
            nextState.activeTab = action.tabIndex
            return nextState
        case AppNav.SET_CONNECTION_STATUS:
            nextState.isConnected = action.isConnected
            return nextState
        case AppNav.TOGGLE_SHOW_SETTINGS:
            nextState.isSettingsOpen = !nextState.isSettingsOpen
            return nextState
        default:
            return nextState
    }
}
