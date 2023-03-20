import { Media, Output } from './mediaModels'
import * as IO from './mediaActions'

function defaultMediaState(): Media {
    return {
        outputs: [],
        folderList: [],
        hiddenFiles: {},
    }
}

function defaultOutputs(amount: number): Output[] {
    let outputs: Output[] = []
    for (let i = 0; i < amount; i++) {
        outputs.push({
            mediaFiles: [],
            thumbnailList: [],
            time: [0, 0],
        })
    }
    return outputs
}

export function media(state: Media = defaultMediaState(), action) {
    let nextState = { ...state }
    switch (action.type) {
        case IO.SET_NUMBER_OF_OUTPUTS:
            nextState.outputs = defaultOutputs(action.amount)
            return nextState
        case IO.UPDATE_MEDIA_FILES:
            if (doesChannelExist(nextState, action)) {
                nextState.outputs[action.channelIndex].mediaFiles = action.files
            }
            return nextState
        case IO.UPDATE_THUMBNAIL_LIST:
            if (doesChannelExist(nextState, action)) {
                nextState.outputs[action.channelIndex].thumbnailList =
                    action.fileList
            }
            return nextState
        case IO.UPDATE_HIDDEN_FILES:
            nextState.hiddenFiles = action.hiddenFiles
            return nextState
        case IO.UPDATE_FOLDER_LIST:
            nextState.folderList = action.folderList
            return nextState
        case IO.SET_TIME:
            if (doesChannelExist(nextState, action)) {
                nextState.outputs[action.channelIndex].time = action.time
            }
            return nextState

        default:
            return nextState
    }
}

function doesChannelExist(
    nextState: Media,
    action: { channelIndex: number }
): boolean {
    return nextState.outputs.length > action.channelIndex
}
