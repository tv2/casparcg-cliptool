export const SET_ACTIVE_TAB = 'setActiveTab'

export const setActiveTab = (tabIndex: number) => {
    return {
        type: SET_ACTIVE_TAB,
        tabIndex: tabIndex,
    }
}
