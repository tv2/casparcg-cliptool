import { AppNavigationState } from '../models/app-navigation-models'
import * as AppNav from './../actions/app-navigation-action'

function defaultAppNavigationReducerState(): AppNavigationState {
    return {
        isConnected: false,
        activeTabIndex: 0,
        isSettingsVisible: false,
    }
}

export function appNavigation(
    state: AppNavigationState = defaultAppNavigationReducerState(),
    action: any
): AppNavigationState {
    let nextState: AppNavigationState = { ...state }

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
