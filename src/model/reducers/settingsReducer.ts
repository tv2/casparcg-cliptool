import { SET_TAB_DATA, UPDATE_SETTINGS } from './settingsAction'
export interface ISettings {
    ccgConfig: ICcgConfig
    tabData: ITabData[]
    generic: IGenericSettings
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
}

const defaultSettingsReducerState: ISettings[] = [
    {
        ccgConfig: {
            channels: [],
        },
        tabData: [],
        generic: {
            transistionTime: 16,
            ccgIp: '0.0.0.0',
            ccgAmcpPort: 5250,
            ccgOscPort: 5253,
            ccgDefaultLayer: 10,
            outputLabels: [],
            outputFolders: [],
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
            nextState[0].ccgConfig.channels = [...action.settings]
            return nextState
        case SET_TAB_DATA:
            nextState[0].tabData = [...action.tabData]
            return nextState
        default:
            return nextState
    }
}
