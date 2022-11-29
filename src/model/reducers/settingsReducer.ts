import { getVideoFormat, VideoFormat } from '../videoFormat'
import { SET_GENERICS, SET_TAB_DATA, UPDATE_SETTINGS } from './settingsAction'
export interface ISettings {
    ccgConfig: ICcgConfig
    tabData: ITabData[]
    generics: IGenericSettings
}
export interface ITabData {
    key: string
    title: string
}

export interface ICcgConfig {
    channels: ICcgConfigChannel[]
    path: string
}

export interface ICcgConfigChannel {
    _type?: string
    videoMode?: string
    videoFormat?: VideoFormat
    consumers?: any[]
    straightAlphaOutput?: boolean
    channelLayout?: string
}

export interface IGenericSettings {
    transistionTime: number
    ccgIp: string
    ccgAmcpPort: number
    ccgDefaultLayer: number
    ccgOscPort: number
    outputLabels: string[]
    outputFolders: string[]
    scale: boolean[]
    scaleX: number[]
    scaleY: number[]
    startupLoopState: boolean[]
    startupMixState: boolean[]
    startupManualstartState: boolean[]
}

export const defaultSettingsReducerState = (): ISettings[] => {
    return [
        {
            ccgConfig: {
                channels: [],
                path: '',
            },
            tabData: [],
            generics: {
                transistionTime: 16,
                ccgIp: '0.0.0.0',
                ccgAmcpPort: 5250,
                ccgOscPort: 5253,
                ccgDefaultLayer: 10,
                outputLabels: ['', '', '', '', '', '', '', ''],
                outputFolders: ['', '', '', '', '', '', '', ''],
                scale: [false, false, false, false, false, false, false, false],
                scaleX: [1920, 1920, 1920, 1920, 1920, 1920, 1920, 1920],
                scaleY: [1080, 1080, 1080, 1080, 1080, 1080, 1080, 1080],
                startupLoopState: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
                startupMixState: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
                startupManualstartState: [
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                    false,
                ],
            },
        },
    ]
}

function updateChannelConfigWithVideoFormat(
    channelConfig: ICcgConfigChannel
): ICcgConfigChannel {
    return {
        ...channelConfig,
        videoFormat: getVideoFormat(channelConfig.videoMode),
    }
}

export const settings = (
    state: ISettings[] = defaultSettingsReducerState(),
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
            nextState[0].generics.startupLoopState =
                nextState[0].generics.startupLoopState ?? []
            nextState[0].generics.startupMixState =
                nextState[0].generics.startupMixState ?? []
            nextState[0].generics.startupManualstartState =
                nextState[0].generics.startupManualstartState ?? []
            return nextState
        default:
            return nextState
    }
}
