import {
    CasparcgConfig,
    CasparcgConfigChannel,
    GenericSettings,
    OutputSettings,
    SettingsState,
} from '../models/settings-models'
import { ReduxSettingsService } from '../services/redux-settings-service'
import { getVideoFormat } from '../video-format'
import * as IO from './../actions/settings-action'

function defaultSettingsReducerState(): SettingsState {
    const generics: GenericSettings =
        new ReduxSettingsService().getDefaultGenericSettings()
    return {
        ccgConfig: {
            channels: [],
            path: '',
        },
        generics: generics,
    }
}

function updateChannelConfigWithVideoFormat(
    channelConfig: CasparcgConfigChannel
): CasparcgConfigChannel {
    return {
        ...channelConfig,
        videoFormat: getVideoFormat(channelConfig.videoMode),
    }
}

export function settings(
    state: SettingsState = defaultSettingsReducerState(),
    action: any
): SettingsState {
    let nextState: SettingsState = { ...state }

    switch (action.type) {
        case IO.UPDATE_SETTINGS: {
            const config: CasparcgConfig = { ...nextState.ccgConfig }
            config.channels = [
                ...action.channels.map(updateChannelConfigWithVideoFormat),
            ]
            config.path = action.path
            nextState.ccgConfig = config
            return nextState
        }
        case IO.SET_GENERICS: {
            nextState.generics = { ...action.generics }
            nextState.generics.outputSettings =
                nextState.generics.outputSettings ?? []
            nextState.generics.outputSettings.forEach((outputSettings) => {
                outputSettings.loopState =
                    outputSettings.initialLoopState ?? false
                outputSettings.mixState =
                    outputSettings.initialMixState ?? false
                outputSettings.webState =
                    outputSettings.initialWebState ?? false
                outputSettings.manualStartState =
                    outputSettings.initialManualStartState ?? false
            })
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
                    selectedFileName: action.filename,
                })
            }
            return nextState
        }
        case IO.SET_CUED_FILE_NAME: {
            if (doesChannelExist(nextState, action)) {
                return updateAttributeByPartial(state, nextState, action, {
                    cuedFileName: action.filename,
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
        case IO.SET_INITIAL_LOOP: {
            if (doesChannelExist(nextState, action)) {
                return updateAttributeByPartial(state, nextState, action, {
                    loopState: action.loopState,
                })
            }
            return nextState
        }
        case IO.SET_INITIAL_MIX: {
            if (doesChannelExist(nextState, action)) {
                return updateAttributeByPartial(state, nextState, action, {
                    mixState: action.mixState,
                })
            }
            return nextState
        }
        case IO.SET_INITIAL_WEB: {
            if (doesChannelExist(nextState, action)) {
                return updateAttributeByPartial(state, nextState, action, {
                    webState: action.webState,
                })
            }
            return nextState
        }
        case IO.SET_INITIAL_MANUAL_START: {
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

function updateAttributeByPartial(
    originalState: SettingsState,
    nextState: SettingsState,
    action: any,
    updates: Partial<OutputSettings>
): SettingsState {
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
    nextState: SettingsState,
    action: { channelIndex: number }
): boolean {
    return nextState.generics.outputSettings.length > action.channelIndex
}
