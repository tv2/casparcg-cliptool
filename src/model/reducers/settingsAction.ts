import { GenericSettings, OperationMode, TabData } from './settingsModels'
import { reduxState } from './store'

export const UPDATE_SETTINGS = 'updateSettings'
export const SET_TAB_DATA = 'setTabData'
export const SET_GENERICS = 'setGenerics'
export const SET_SCALING = 'setScaling'
export const SET_LOOP = 'setLoop'
export const SET_MIX = 'setMix'
export const SET_WEB = 'setWeb'
export const SET_MANUAL_START = 'setManualStart'
export const SET_OPERATION_MODE = 'setOperationMode'
export const SET_SELECTED_FILE_NAME = 'setSelectedFileName'

export const updateSettings = (channels, path: string) => {
    return {
        type: UPDATE_SETTINGS,
        channels,
        path,
    }
}

export const setTabData = (amount: number) => {
    let tabData: TabData[] = []
    for (let i = 0; i < amount; i++) {
        tabData.push({
            key: String(i),
            title:
                reduxState.settings[0].generics.outputs[i].label ||
                'Output ' + String(i + 1),
        })
    }
    return {
        type: SET_TAB_DATA,
        tabData: tabData,
    }
}

export const setGenerics = (generics: GenericSettings) => {
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

export const setLoop = (channelIndex: number, loopState: boolean) => {
    return {
        type: SET_LOOP,
        channelIndex: channelIndex,
        loopState: loopState,
    }
}

export const setMix = (channelIndex: number, mixState: boolean) => {
    return {
        type: SET_MIX,
        channelIndex: channelIndex,
        mixState: mixState,
    }
}

export const setManualStart = (
    channelIndex: number,
    manualStartState: boolean
) => {
    return {
        type: SET_MANUAL_START,
        channelIndex: channelIndex,
        manualStartState: manualStartState,
    }
}

export const setWeb = (channelIndex: number, webState: boolean) => {
    return {
        type: SET_WEB,
        channelIndex: channelIndex,
        webState: webState,
    }
}

export const setOperationMode = (
    channelIndex: number,
    operationMode: OperationMode
) => {
    return {
        type: SET_OPERATION_MODE,
        channelIndex: channelIndex,
        operationMode: operationMode,
    }
}

export const setSelectedFileName = (channelIndex: number, filename: string) => {
    return {
        type: SET_SELECTED_FILE_NAME,
        channelIndex: channelIndex,
        filename: filename,
    }
}
