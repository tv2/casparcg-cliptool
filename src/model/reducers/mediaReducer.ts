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

export function media(state: Media = defaultMediaState(), action: any) {
    let nextState = { ...state }
    switch (action.type) {
        case IO.SET_NUMBER_OF_OUTPUTS:
            nextState.outputs = defaultOutputs(action.amount)
            return nextState
        case IO.UPDATE_MEDIA_FILES:
            if (doesChannelExist(nextState, action)) {
                const outputs = [...nextState.outputs]
                const output = { ...outputs[action.channelIndex] }
                output.mediaFiles = action.files
                outputs[action.channelIndex] = output
                nextState.outputs = outputs
            }
            return nextState
        case IO.UPDATE_THUMBNAIL_LIST:
            if (doesChannelExist(nextState, action)) {
                const outputs = [...nextState.outputs]
                const output = { ...outputs[action.channelIndex] }
                output.thumbnailList = action.fileList
                outputs[action.channelIndex] = output
                nextState.outputs = outputs
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
                const outputs = [...nextState.outputs]
                const output = { ...outputs[action.channelIndex] }
                output.time = action.time
                outputs[action.channelIndex] = output
                nextState.outputs = outputs
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
