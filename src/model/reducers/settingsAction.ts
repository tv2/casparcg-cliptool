import { IGenericSettings, ITabData } from './settingsReducer'
import { reduxState } from './store'

export const UPDATE_SETTINGS = 'updateSettings'
export const SET_TAB_DATA = 'setTabData'
export const SET_GENERICS = 'setGenerics'
export const SET_SCALING = 'setScaling'

export const updateSettings = (channels) => {
    return {
        type: UPDATE_SETTINGS,
        channels,
    }
}

export const setTabData = (amount: number) => {
    let tabData: ITabData[] = []
    for (let i = 0; i < amount; i++) {
        tabData.push({
            key: String(i),
            title:
                reduxState.settings[0].generics.outputLabels[i] ||
                'Output ' + String(i + 1),
        })
    }
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

export const setScaling = (scaleX: number, scaleY: number) => {
    return {
        type: SET_SCALING,
        scaleX: scaleX,
        scaleY: scaleY,
    }
}
