import settingsFileService from '../services/settingsFileService'
import { getVideoFormat, VideoFormat } from '../videoFormat'
import * as IO from './settingsAction'

export enum OperationMode {
    CONTROL = 'control',
    EDIT_VISIBILITY = 'edit_visibility',
}
export interface Settings {
    ccgConfig: CcgConfig
    tabData: TabData[]
    generics: GenericSettings
}
export interface TabData {
    key: string
    title: string
}

export interface CcgConfig {
    channels: CcgConfigChannel[]
    path: string
}

export interface CcgConfigChannel {
    _type?: string
    videoMode?: string
    videoFormat?: VideoFormat
    consumers?: any[]
    straightAlphaOutput?: boolean
    channelLayout?: string
}

export interface OutputSettings {
    label: string
    folder: string
    shouldScale: boolean
    scaleX: number
    scaleY: number
    webUrl: string
    loopState: boolean
    mixState: boolean
    manualStartState: boolean
    webState: boolean
    operationMode: OperationMode
    selectedFile: string
}

export interface GenericSettings {
    transitionTime: number
    ccgIp: string
    ccgAmcpPort: number
    ccgDefaultLayer: number
    ccgOscPort: number
    outputs: OutputSettings[]
}

export const defaultSettingsReducerState = (): Settings[] => {
    return [
        {
            ccgConfig: {
                channels: [],
                path: '',
            },
            tabData: [],
            generics: settingsFileService.getDefaultGenericSettings(),
        },
    ]
}

function updateChannelConfigWithVideoFormat(
    channelConfig: CcgConfigChannel
): CcgConfigChannel {
    return {
        ...channelConfig,
        videoFormat: getVideoFormat(channelConfig.videoMode),
    }
}

export const settings = (
    state: Settings[] = defaultSettingsReducerState(),
    action
) => {
    let nextState = { ...state }

    switch (action.type) {
        case IO.UPDATE_SETTINGS: {
            nextState[0].ccgConfig.channels = [
                ...action.channels.map(updateChannelConfigWithVideoFormat),
            ]
            nextState[0].ccgConfig.path = action.path
            return nextState
        }
        case IO.SET_TAB_DATA: {
            nextState[0].tabData = [...action.tabData]
            return nextState
        }
        case IO.SET_GENERICS: {
            nextState[0].generics = { ...action.generics }
            nextState[0].generics.outputs = nextState[0].generics.outputs ?? []
            return nextState
        }
        case IO.SET_LOOP: {
            if (doesChannelExist(nextState, action)) {
                nextState[0].generics.outputs[action.channelIndex].loopState =
                    action.loopState
            }
            return nextState
        }
        case IO.SET_SELECTED_FILE_NAME: {
            if (doesChannelExist(nextState, action)) {
                nextState[0].generics.outputs[
                    action.channelIndex
                ].selectedFile = action.filename
            }
            return nextState
        }
        case IO.SET_MIX: {
            if (doesChannelExist(nextState, action)) {
                nextState[0].generics.outputs[action.channelIndex].mixState =
                    action.mixState
            }
            return nextState
        }
        case IO.SET_WEB: {
            if (doesChannelExist(nextState, action)) {
                nextState[0].generics.outputs[action.channelIndex].webState =
                    action.webState
            }
            return nextState
        }
        case IO.SET_MANUAL_START: {
            if (doesChannelExist(nextState, action)) {
                nextState[0].generics.outputs[
                    action.channelIndex
                ].manualStartState = action.manualStartState
            }
            return nextState
        }
        case IO.SET_OPERATION_MODE: {
            if (doesChannelExist(nextState, action)) {
                nextState[0].generics.outputs[
                    action.channelIndex
                ].operationMode = action.operationMode
            }
            return nextState
        }
        default:
            return nextState
    }
}

function doesChannelExist(
    nextState: Settings[],
    action: { channelIndex: number }
): boolean {
    return nextState[0].generics.outputs.length > action.channelIndex
}
