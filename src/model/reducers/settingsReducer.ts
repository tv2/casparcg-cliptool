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
}

const defaultSettingsReducerState: ISettings[] = [
    {
        ccgConfig: {
            channels: [],
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
        },
    },
]

export const settings = (
    state: ISettings[] = defaultSettingsReducerState,
    action
) => {
    let nextState = { ...state }

    switch (action.type) {
        case UPDATE_SETTINGS:
            nextState[0].ccgConfig.channels = [
                ...action.channels.map((channel) => ({
                    ...channel,
                    videoFormat: getVideoFormat(channel.videoMode),
                })),
            ]
            return nextState
        case SET_TAB_DATA:
            nextState[0].tabData = [...action.tabData]
            return nextState
        case SET_GENERICS:
            nextState[0].generics = { ...action.generics }
            return nextState
        default:
            return nextState
    }
}
