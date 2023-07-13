import { MediaState, Output } from './../models/media-models'
import * as IO from './../actions/media-actions'

function defaultMediaState(): MediaState {
    return {
        outputs: [],
        folders: [],
        hiddenFiles: {},
    }
}

function defaultOutputs(amount: number): Output[] {
    return Array(amount).fill({
        mediaFiles: [],
        thumbnailList: [],
        time: [0, 0],
    })
}

export function media(
    state: MediaState = defaultMediaState(),
    action: any
): MediaState {
    let nextState: MediaState = { ...state }
    switch (action.type) {
        case IO.SET_NUMBER_OF_OUTPUTS:
            nextState.outputs = defaultOutputs(action.amount)
            return nextState
        case IO.UPDATE_MEDIA_FILES:
            if (doesMediaOutputChannelExist(nextState, action.channelIndex)) {
                return updateAttributeByPartial(state, nextState, action, {
                    mediaFiles: action.files,
                })
            }
            return nextState
        case IO.UPDATE_THUMBNAIL_LIST:
            if (doesMediaOutputChannelExist(nextState, action.channelIndex)) {
                return updateAttributeByPartial(state, nextState, action, {
                    thumbnailList: action.fileList,
                })
            }
            return nextState
        case IO.UPDATE_HIDDEN_FILES:
            nextState.hiddenFiles = action.hiddenFiles
            return nextState
        case IO.UPDATE_FOLDER_LIST:
            nextState.folders = action.folders
            return nextState
        case IO.SET_TIME:
            if (doesMediaOutputChannelExist(nextState, action.channelIndex)) {
                return updateAttributeByPartial(state, nextState, action, {
                    time: action.time,
                })
            }
            return nextState

        default:
            return nextState
    }
}

function doesMediaOutputChannelExist(
    nextState: MediaState,
    channelIndex: number
): boolean {
    return nextState.outputs.length > channelIndex
}

function updateAttributeByPartial(
    originalState: MediaState,
    nextState: MediaState,
    action: any,
    updates: Partial<Output>
): MediaState {
    const outputs = [...originalState.outputs]
    outputs[action.channelIndex] = {
        ...outputs[action.channelIndex],
        ...updates,
    }
    nextState = {
        ...originalState,
        outputs,
    }
    return nextState
}
