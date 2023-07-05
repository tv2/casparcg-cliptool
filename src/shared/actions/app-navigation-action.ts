export const SET_ACTIVE_TAB_INDEX = 'setActiveTabIndex'
export const SET_CONNECTION_STATUS = 'setConnectionStatus'
export const TOGGLE_SHOW_SETTINGS = 'toggleShowSettings'

export function setActiveTabIndex(tabIndex: number): {
    type: string
    tabIndex: number
} {
    return {
        type: SET_ACTIVE_TAB_INDEX,
        tabIndex: tabIndex,
    }
}

export function setConnectionStatus(isConnected: boolean): {
    type: string
    isConnected: boolean
} {
    return {
        type: SET_CONNECTION_STATUS,
        isConnected: isConnected,
    }
}

export function toggleSettingsVisibility(): { type: string } {
    return {
        type: TOGGLE_SHOW_SETTINGS,
    }
}
