import * as IO from './mediaActions'

export interface HiddenFileInfo {
    changed: number
    size: number
}

interface File extends HiddenFileInfo {
    name: string
    type: string
}

export interface IMediaFile extends File {
    frames: number
    frameTime: string
    frameRate: number
    duration: number
}

export interface IThumbnailFile extends File {
    thumbnail: string
}
export interface IMedia {
    output: IOutput[]
    folderList: string[]
    hiddenFiles: Record<string, HiddenFileInfo>
}

export interface IOutput {
    mediaFiles: IMediaFile[]
    thumbnailList: IThumbnailFile[]
    tallyFile: string
    time: [number, number]
}

const defaultMediaState = (): Array<IMedia> => {
    return [
        {
            output: [],
            folderList: [],
            hiddenFiles: {},
        },
    ]
}

const defaultOutputs = (amount: number) => {
    let outputs: IOutput[] = []
    for (let i = 0; i < amount; i++) {
        outputs.push({
            mediaFiles: [],
            thumbnailList: [],
            tallyFile: '',
            time: [0, 0],
        })
    }
    return outputs
}

export const media = (state: Array<IMedia> = defaultMediaState(), action) => {
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
        case IO.SET_TALLY_FILE_NAME:
            if (doesChannelExist(nextState, action)) {
                nextState[0].output[action.channelIndex].tallyFile =
                    action.filename
            }
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
    nextState: { output: IOutput[] }[],
    action: { channelIndex: number }
): boolean {
    return nextState[0].output.length > action.channelIndex
}
