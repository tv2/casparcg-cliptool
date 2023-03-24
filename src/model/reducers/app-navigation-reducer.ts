import * as AppNav from './app-navigation-action'
export interface AppNavigation {
    connectionStatus: boolean
    activeTab: number
    showSettingsActive: boolean
    selectView: number
}

function defaultAppNavReducerState(): AppNavigation {
    return {
        connectionStatus: false,
        activeTab: 0,
        showSettingsActive: false,
        selectView: 0,
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
            nextState.connectionStatus = action.connectionStatus
            return nextState
        case AppNav.TOGGLE_SHOW_SETTINGS:
            nextState.showSettingsActive = !nextState.showSettingsActive
            return nextState
        case AppNav.SELECT_VIEW:
            nextState.selectView = action.selectView
            return nextState
        default:
            return nextState
    }
}
