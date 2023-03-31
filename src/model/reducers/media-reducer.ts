import { Media, Output } from './media-models'
import * as IO from './media-actions'
import reducerService from '../services/reducer-service'

function defaultMediaState(): Media {
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

export function media(state: Media = defaultMediaState(), action: any) {
    let nextState = { ...state }
    switch (action.type) {
        case IO.SET_NUMBER_OF_OUTPUTS:
            nextState.outputs = defaultOutputs(action.amount)
            return nextState
        case IO.UPDATE_MEDIA_FILES:
            if (
                reducerService.doesMediaOutputChannelExist(
                    nextState,
                    action.channelIndex
                )
            ) {
                return updateAttributeByPartial(state, nextState, action, {
                    mediaFiles: action.files,
                })
            }
            return nextState
        case IO.UPDATE_THUMBNAIL_LIST:
            if (
                reducerService.doesMediaOutputChannelExist(
                    nextState,
                    action.channelIndex
                )
            ) {
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
            if (
                reducerService.doesMediaOutputChannelExist(
                    nextState,
                    action.channelIndex
                )
            ) {
                return updateAttributeByPartial(state, nextState, action, {
                    time: action.time,
                })
            }
            return nextState

        default:
            return nextState
    }
}

// TODO: get help moving to reducerService.
function updateAttributeByPartial(
    originalState: Media,
    nextState: Media,
    action: any,
    updates: Partial<Output>
): Media {
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
