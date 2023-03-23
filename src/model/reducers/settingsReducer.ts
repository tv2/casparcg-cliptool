import settingsService from '../services/settingsService'
import { getVideoFormat } from '../videoFormat'
import * as IO from './settingsAction'
import { CcgConfigChannel, Settings } from './settingsModels'

function defaultSettingsReducerState(): Settings {
    const generics = settingsService.getDefaultGenericSettings()
    return {
        ccgConfig: {
            channels: [],
            path: '',
        },
        tabData: [],
        generics: generics,
    }
}

function updateChannelConfigWithVideoFormat(
    channelConfig: CcgConfigChannel
): CcgConfigChannel {
    return {
        ...channelConfig,
        videoFormat: getVideoFormat(channelConfig.videoMode),
    }
}

export function settings(
    state: Settings = defaultSettingsReducerState(),
    action: any
) {
    let nextState = { ...state }

    switch (action.type) {
        case IO.UPDATE_SETTINGS: {
            nextState.ccgConfig.channels = [
                ...action.channels.map(updateChannelConfigWithVideoFormat),
            ]
            nextState.ccgConfig.path = action.path
            return nextState
        }
        case IO.SET_TAB_DATA: {
            nextState.tabData = [...action.tabData]
            return nextState
        }
        case IO.SET_GENERICS: {
            nextState.generics = { ...action.generics }
            nextState.generics.outputSettings =
                nextState.generics.outputSettings ?? []
            return nextState
        }
        case IO.SET_LOOP: {
            if (doesChannelExist(nextState, action)) {
                nextState.generics.outputSettings[
                    action.channelIndex
                ].loopState = action.loopState
            }
            return nextState
        }
        case IO.SET_SELECTED_FILE_NAME: {
            if (doesChannelExist(nextState, action)) {
                nextState.generics.outputSettings[
                    action.channelIndex
                ].selectedFile = action.filename
            }
            return nextState
        }
        case IO.SET_MIX: {
            if (doesChannelExist(nextState, action)) {
                nextState.generics.outputSettings[
                    action.channelIndex
                ].mixState = action.mixState
            }
            return nextState
        }
        case IO.SET_WEB: {
            if (doesChannelExist(nextState, action)) {
                nextState.generics.outputSettings[
                    action.channelIndex
                ].webState = action.webState
            }
            return nextState
        }
        case IO.SET_MANUAL_START: {
            if (doesChannelExist(nextState, action)) {
                nextState.generics.outputSettings[
                    action.channelIndex
                ].manualStartState = action.manualStartState
            }
            return nextState
        }
        case IO.SET_OPERATION_MODE: {
            if (doesChannelExist(nextState, action)) {
                nextState.generics.outputSettings[
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
    nextState: Settings,
    action: { channelIndex: number }
): boolean {
    return nextState.generics.outputSettings.length > action.channelIndex
}
