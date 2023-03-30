import * as AppNav from './app-navigation-action'
export interface AppNavigation {
    isConnected: boolean
    activeTab: number
    showSettingsActive: boolean
}

function defaultAppNavReducerState(): AppNavigation {
    return {
        isConnected: false,
        activeTab: 0,
        showSettingsActive: false,
    }
}

export function appNavigation(
    state: AppNavigation = defaultAppNavReducerState(),
    action: any
) {
    let nextState = { ...state }

    switch (action.type) {
        case AppNav.SET_ACTIVE_TAB:
            nextState.activeTab = action.tabIndex
            return nextState
        case AppNav.SET_CONNECTION_STATUS:
            nextState.isConnected = action.connectionStatus
            return nextState
        case AppNav.TOGGLE_SHOW_SETTINGS:
            nextState.showSettingsActive = !nextState.showSettingsActive
            return nextState
        default:
            return nextState
    }
}
