export const SET_ACTIVE_TAB = 'setActiveTab'
export const SELECT_VIEW = 'selectView'
export const SET_CONNECTION_STATUS = 'setConnectionStatus'
export const TOGGLE_SHOW_SETTINGS = 'toggleShowSettings'

export const setActiveTab = (tabIndex: number) => {
    return {
        type: SET_ACTIVE_TAB,
        tabIndex: tabIndex,
    }
}

export const setSelectView = (selectView: number) => {
    return {
        type: SELECT_VIEW,
        selectView: selectView,
    }
}

export const setConnectionStatus = (connectionStatus: boolean) => {
    return {
        type: SET_CONNECTION_STATUS,
        connectionStatus: connectionStatus,
    }
}

export const toggleShowSettings = () => {
    return {
        type: TOGGLE_SHOW_SETTINGS,
    }
}
