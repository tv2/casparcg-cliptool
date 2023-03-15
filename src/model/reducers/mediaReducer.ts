import * as IO from './mediaActions'

export interface HiddenFileInfo {
    changed: number
    size: number
}

interface File extends HiddenFileInfo {
    name: string
    type: string
}

export interface MediaFile extends File {
    frames: number
    frameTime: string
    frameRate: number
    duration: number
}

export interface ThumbnailFile extends File {
    thumbnail: string
}
export interface Media {
    output: Output[]
    folderList: string[]
    hiddenFiles: Record<string, HiddenFileInfo>
}

export interface Output {
    mediaFiles: MediaFile[]
    thumbnailList: ThumbnailFile[]
    time: [number, number]
}

const defaultMediaState = (): Array<Media> => {
    return [
        {
            output: [],
            folderList: [],
            hiddenFiles: {},
        },
    ]
}

const defaultOutputs = (amount: number) => {
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

export const media = (state: Array<Media> = defaultMediaState(), action) => {
    let nextState = { ...state }

    switch (action.type) {
        case IO.SET_NUMBER_OF_OUTPUTS:
            nextState[0].output = defaultOutputs(action.amount)
            return nextState
        case IO.UPDATE_MEDIA_FILES:
            if (doesChannelExist(nextState, action)) {
                nextState[0].output[action.channelIndex].mediaFiles =
                    action.files
            }
            return nextState
        case IO.UPDATE_THUMB_LIST:
            if (doesChannelExist(nextState, action)) {
                nextState[0].output[action.channelIndex].thumbnailList =
                    action.fileList
            }
            return nextState
        case IO.UPDATE_HIDDEN_FILES:
            nextState[0].hiddenFiles = action.hiddenFiles
            return nextState
        case IO.UPDATE_FOLDER_LIST:
            nextState[0].folderList = action.folderList
            return nextState
        case IO.SET_TIME:
            if (doesChannelExist(nextState, action)) {
                nextState[0].output[action.channelIndex].time = action.time
            }
            return nextState

        default:
            return nextState
    }
}

function doesChannelExist(
    nextState: { output: Output[] }[],
    action: { channelIndex: number }
): boolean {
    return nextState[0].output.length > action.channelIndex
}
