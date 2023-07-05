import { AppNavigation } from '../models/app-navigation-models'
import * as AppNav from './../actions/app-navigation-action'

function defaultAppNavigationReducerState(): AppNavigation {
    return {
        isConnected: false,
        activeTabIndex: 0,
        isSettingsVisible: false,
    }
}

export function appNavigation(
    state: AppNavigation = defaultAppNavigationReducerState(),
    action: any
): AppNavigation {
    let nextState: AppNavigation = { ...state }

    switch (action.type) {
        case AppNav.SET_ACTIVE_TAB_INDEX:
            nextState.activeTabIndex = action.tabIndex
            return nextState
        case AppNav.SET_CONNECTION_STATUS:
            nextState.isConnected = action.isConnected
            return nextState
        case AppNav.TOGGLE_SHOW_SETTINGS:
            nextState.isSettingsVisible = !nextState.isSettingsVisible
            return nextState
        default:
            return nextState
    }
}
