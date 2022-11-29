import * as IO from './mediaActions'

export interface IMediaFile {
    name: string
    type: string
    size: number
    changed: number
    frames: number
    frameTime: string
    frameRate: number
    duration: number
}

export interface IThumbFile {
    name: string
    type: string
    changed: number
    size: number
    thumbnail?: any
}
export interface IMedia {
    output: IOutput[]
    folderList: string[]
}

export interface IOutput {
    mediaFiles: IMediaFile[]
    thumbnailList: IThumbFile[]
    tallyFile: string
    loopState: boolean
    mixState: boolean
    manualstartState: boolean
    time: [number, number]
}

const defaultMediaState = (): Array<IMedia> => {
    return [
        {
            output: [],
            folderList: [],
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
            loopState: false,
            mixState: false,
            manualstartState: false,
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
            if (nextState[0].output.length >= action.channelIndex) {
                nextState[0].output[action.channelIndex].mediaFiles =
                    action.files
            }
            return nextState
        case IO.UPDATE_THUMB_LIST:
            if (nextState[0].output.length >= action.channelIndex) {
                nextState[0].output[action.channelIndex].thumbnailList =
                    action.fileList
            }
            return nextState
        case IO.UPDATE_FOLDER_LIST:
            nextState[0].folderList = action.folderList
            return nextState
        case IO.SET_TALLY_FILE_NAME:
            if (nextState[0].output.length >= action.channelIndex) {
                nextState[0].output[action.channelIndex].tallyFile =
                    action.filename
            }
            return nextState
        case IO.SET_LOOP:
            if (nextState[0].output.length >= action.channelIndex) {
                nextState[0].output[action.channelIndex].loopState =
                    action.loopState
            }
            return nextState
        case IO.SET_MIX:
            if (nextState[0].output.length >= action.channelIndex) {
                nextState[0].output[action.channelIndex].mixState =
                    action.mixState
            }
            return nextState
        case IO.SET_MANUAL_START:
            if (nextState[0].output.length >= action.channelIndex) {
                nextState[0].output[action.channelIndex].manualstartState =
                    action.manualstartState
            }
            return nextState
        case IO.SET_TIME:
            if (nextState[0].output.length >= action.channelIndex) {
                nextState[0].output[action.channelIndex].time = action.time
            }
            return nextState
        default:
            return nextState
    }
}
