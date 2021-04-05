import { SET_TAB_DATA, UPDATE_SETTINGS } from './settingsAction'
export interface ISettings {
    ccgSettings: any
    tabData: ITabData[]
}
export interface ITabData {
    key: string
    title: string
}

export interface ICcgSettings {
    channels: [
        {
            _type: string
            videoMode: string
            consumers: any[]
            straightAlphaOutput: boolean
            channelLayout: string
        }
    ]
}

const defaultSettingsReducerState: ISettings[] = [
    {
        ccgSettings: {
            channels: [],
        },
        tabData: [],
    },
]

export const settings = (
    state: ISettings[] = defaultSettingsReducerState,
    action
) => {
    let nextState = { ...state }

    switch (action.type) {
        case UPDATE_SETTINGS:
            nextState[0].ccgSettings.channels = [...action.settings]
            return nextState
        case SET_TAB_DATA:
            nextState[0].tabData = [...action.tabData]
            return nextState
        default:
            return nextState
    }
}
