export const UPDATE_SETTINGS = 'updateSettings'
export const SET_TAB_DATA = 'setTabData'

export const updateSettings = (settings) => {
    return {
        type: UPDATE_SETTINGS,
        settings: settings,
    }
}

export const setTabData = (tabData) => {
    return {
        type: SET_TAB_DATA,
        tabData: tabData,
    }
}
