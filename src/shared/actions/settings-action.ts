import { GenericSettings, OperationMode } from './../models/settings-models'

export const UPDATE_SETTINGS = 'updateSettings'
export const SET_GENERICS = 'setGenerics'
export const SET_SCALING = 'setScaling'
export const SET_LOOP = 'setLoop'
export const SET_MIX = 'setMix'
export const SET_WEB = 'setWeb'
export const SET_MANUAL_START = 'setManualStart'
export const SET_OPERATION_MODE = 'setOperationMode'
export const SET_SELECTED_FILE_NAME = 'setSelectedFileName'
export const SET_CUED_FILE_NAME = 'setCuedFileName'

export function updateSettings(
    channels: any,
    path: string
): { type: string; channels: any; path: string } {
    return {
        type: UPDATE_SETTINGS,
        channels,
        path,
    }
}

export function setGenerics(generics: GenericSettings): {
    type: string
    generics: GenericSettings
} {
    return {
        type: SET_GENERICS,
        generics: generics,
    }
}

export function setScaling(
    scaleX: number,
    scaleY: number
): { type: string; scaleX: number; scaleY: number } {
    return {
        type: SET_SCALING,
        scaleX: scaleX,
        scaleY: scaleY,
    }
}

export function setLoop(
    channelIndex: number,
    loopState: boolean
): { type: string; channelIndex: number; loopState: boolean } {
    return {
        type: SET_LOOP,
        channelIndex: channelIndex,
        loopState: loopState,
    }
}

export function setMix(
    channelIndex: number,
    mixState: boolean
): { type: string; channelIndex: number; mixState: boolean } {
    return {
        type: SET_MIX,
        channelIndex: channelIndex,
        mixState: mixState,
    }
}

export function setManualStart(
    channelIndex: number,
    manualStartState: boolean
): { type: string; channelIndex: number; manualStartState: boolean } {
    return {
        type: SET_MANUAL_START,
        channelIndex: channelIndex,
        manualStartState: manualStartState,
    }
}

export function setWeb(
    channelIndex: number,
    webState: boolean
): { type: string; channelIndex: number; webState: boolean } {
    return {
        type: SET_WEB,
        channelIndex: channelIndex,
        webState: webState,
    }
}

export function setOperationMode(
    channelIndex: number,
    operationMode: OperationMode
): { type: string; channelIndex: number; operationMode: OperationMode } {
    return {
        type: SET_OPERATION_MODE,
        channelIndex: channelIndex,
        operationMode: operationMode,
    }
}

export function setSelectedFileName(
    channelIndex: number,
    filename: string
): { type: string; channelIndex: number; filename: string } {
    return {
        type: SET_SELECTED_FILE_NAME,
        channelIndex: channelIndex,
        filename: filename,
    }
}

export function setCuedFileName(
    channelIndex: number,
    filename: string
): { type: string; channelIndex: number; filename: string } {
    return {
        type: SET_CUED_FILE_NAME,
        channelIndex: channelIndex,
        filename: filename,
    }
}
