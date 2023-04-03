import { CcgConfigChannel, OutputSettings, Settings } from './settings-models'
import settingsService from '../services/settings-service'
import { getVideoFormat } from '../video-format'
import * as IO from './settings-action'

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
            const config = { ...nextState.ccgConfig }
            config.channels = [
                ...action.channels.map(updateChannelConfigWithVideoFormat),
            ]
            config.path = action.path
            nextState.ccgConfig = config
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
                return updateAttributeByPartial(state, nextState, action, {
                    loopState: action.loopState,
                })
            }
            return nextState
        }
        case IO.SET_SELECTED_FILE_NAME: {
            if (doesChannelExist(nextState, action)) {
                return updateAttributeByPartial(state, nextState, action, {
                    selectedFile: action.filename,
                })
            }
            return nextState
        }
        case IO.SET_LOADED_FILE_NAME: {
            if (doesChannelExist(nextState, action)) {
                return updateAttributeByPartial(state, nextState, action, {
                    loadedFile: action.filename,
                })
            }
            return nextState
        }
        case IO.SET_MIX: {
            if (doesChannelExist(nextState, action)) {
                return updateAttributeByPartial(state, nextState, action, {
                    mixState: action.mixState,
                })
            }
            return nextState
        }
        case IO.SET_WEB: {
            if (doesChannelExist(nextState, action)) {
                return updateAttributeByPartial(state, nextState, action, {
                    webState: action.webState,
                })
            }
            return nextState
        }
        case IO.SET_MANUAL_START: {
            if (doesChannelExist(nextState, action)) {
                return updateAttributeByPartial(state, nextState, action, {
                    manualStartState: action.manualStartState,
                })
            }
            return nextState
        }
        case IO.SET_OPERATION_MODE: {
            if (doesChannelExist(nextState, action)) {
                return updateAttributeByPartial(state, nextState, action, {
                    operationMode: action.operationMode,
                })
            }
            return nextState
        }
        default:
            return nextState
    }
}

// TODO: get help moving to reducerService.
function updateAttributeByPartial(
    originalState: Settings,
    nextState: Settings,
    action: any,
    updates: Partial<OutputSettings>
): Settings {
    const outputSettings = [...originalState.generics.outputSettings]
    outputSettings[action.channelIndex] = {
        ...outputSettings[action.channelIndex],
        ...updates,
    }
    nextState = {
        ...originalState,
        generics: {
            ...originalState.generics,
            outputSettings,
        },
    }
    return nextState
}

function doesChannelExist(
    nextState: Settings,
    action: { channelIndex: number }
): boolean {
    return nextState.generics.outputSettings.length > action.channelIndex
}
