import { getVideoFormat, VideoFormat } from '../videoFormat'
import { OperationMode } from './mediaReducer'
import { SET_GENERICS, SET_TAB_DATA, UPDATE_SETTINGS } from './settingsAction'
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
            generics: {
                transitionTime: 16,
                ccgIp: '0.0.0.0',
                ccgAmcpPort: 5250,
                ccgOscPort: 5253,
                ccgDefaultLayer: 10,
                outputs: [
                    {
                        label: '',
                        folder: '',
                        shouldScale: false,
                        scaleX: 1920,
                        scaleY: 1080,
                        loopState: false,
                        mixState: false,
                        manualStartState: false,
                        webState: false,
                        webUrl: '',
                        operationMode: OperationMode.CONTROL,
                    },
                    {
                        label: '',
                        folder: '',
                        shouldScale: false,
                        scaleX: 1920,
                        scaleY: 1080,
                        loopState: false,
                        mixState: false,
                        manualStartState: false,
                        webState: false,
                        webUrl: '',
                        operationMode: OperationMode.CONTROL,
                    },
                    {
                        label: '',
                        folder: '',
                        shouldScale: false,
                        scaleX: 1920,
                        scaleY: 1080,
                        loopState: false,
                        mixState: false,
                        manualStartState: false,
                        webState: false,
                        webUrl: '',
                        operationMode: OperationMode.CONTROL,
                    },
                    {
                        label: '',
                        folder: '',
                        shouldScale: false,
                        scaleX: 1920,
                        scaleY: 1080,
                        loopState: false,
                        mixState: false,
                        manualStartState: false,
                        webState: false,
                        webUrl: '',
                        operationMode: OperationMode.CONTROL,
                    },
                    {
                        label: '',
                        folder: '',
                        shouldScale: false,
                        scaleX: 1920,
                        scaleY: 1080,
                        loopState: false,
                        mixState: false,
                        manualStartState: false,
                        webState: false,
                        webUrl: '',
                        operationMode: OperationMode.CONTROL,
                    },
                    {
                        label: '',
                        folder: '',
                        shouldScale: false,
                        scaleX: 1920,
                        scaleY: 1080,
                        loopState: false,
                        mixState: false,
                        manualStartState: false,
                        webState: false,
                        webUrl: '',
                        operationMode: OperationMode.CONTROL,
                    },
                    {
                        label: '',
                        folder: '',
                        shouldScale: false,
                        scaleX: 1920,
                        scaleY: 1080,
                        loopState: false,
                        mixState: false,
                        manualStartState: false,
                        webState: false,
                        webUrl: '',
                        operationMode: OperationMode.CONTROL,
                    },
                    {
                        label: '',
                        folder: '',
                        shouldScale: false,
                        scaleX: 1920,
                        scaleY: 1080,
                        loopState: false,
                        mixState: false,
                        manualStartState: false,
                        webState: false,
                        webUrl: '',
                        operationMode: OperationMode.CONTROL,
                    },
                ],
            },
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
        case UPDATE_SETTINGS:
            nextState[0].ccgConfig.channels = [
                ...action.channels.map(updateChannelConfigWithVideoFormat),
            ]
            nextState[0].ccgConfig.path = action.path
            return nextState
        case SET_TAB_DATA:
            nextState[0].tabData = [...action.tabData]
            return nextState
        case SET_GENERICS:
            nextState[0].generics = { ...action.generics }
            nextState[0].generics.outputs = nextState[0].generics.outputs ?? []
            return nextState
        default:
            return nextState
    }
}
