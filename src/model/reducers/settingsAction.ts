import { IGenericSettings } from './settingsReducer'

export const UPDATE_SETTINGS = 'updateSettings'
export const SET_TAB_DATA = 'setTabData'
export const SET_GENERICS = 'setGenerics'

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

export const setGenerics = (generics: IGenericSettings) => {
    return {
        type: SET_GENERICS,
        generics: generics,
    }
}
