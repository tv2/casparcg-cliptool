import * as AppNav from './appNavAction'
export interface INavReducer {
    connectionStatus: boolean
    activeTab: number
    showSettingsActive: boolean
    selectView: number
}

const defaultAppNavReducerState: INavReducer[] = [
    {
        connectionStatus: false,
        activeTab: 0,
        showSettingsActive: false,
        selectView: 0,
    },
]

export const appNav = (state = defaultAppNavReducerState, action) => {
    let nextState = { ...state }

    switch (action.type) {
        case AppNav.SET_ACTIVE_TAB:
            nextState[0].activeTab = action.tabIndex
            return nextState
        case 'SET_CONNECTION_STATUS':
            nextState[0].connectionStatus = action.data
            return nextState
        case 'TOGGLE_SHOW_SETTINGS':
            nextState[0].showSettingsActive = !nextState[0].showSettingsActive
            return nextState
        default:
            return nextState
    }
}
