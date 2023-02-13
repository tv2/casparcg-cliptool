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
    isVisible: boolean
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
    webState: boolean
    visibilityState: boolean
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
            visibilityState: false,
            loopState: false,
            mixState: false,
            webState: false,
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
            break
        case IO.UPDATE_MEDIA_FILES:
            if (doesChannelExist(nextState, action)) {
                nextState[0].output[action.channelIndex].mediaFiles =
                    action.files
            }
            break
        case IO.UPDATE_THUMB_LIST:
            if (doesChannelExist(nextState, action)) {
                nextState[0].output[action.channelIndex].thumbnailList =
                    action.fileList
            }
            break
        case IO.UPDATE_FOLDER_LIST:
            nextState[0].folderList = action.folderList
            break
        case IO.SET_TALLY_FILE_NAME:
            if (doesChannelExist(nextState, action)) {
                nextState[0].output[action.channelIndex].tallyFile =
                    action.filename
            }
            break
        case IO.SET_LOOP:
            if (doesChannelExist(nextState, action)) {
                nextState[0].output[action.channelIndex].loopState =
                    action.loopState
            }
            break
        case IO.SET_MIX:
            if (doesChannelExist(nextState, action)) {
                nextState[0].output[action.channelIndex].mixState =
                    action.mixState
            }
            break
        case IO.SET_WEB:
            if (doesChannelExist(nextState, action)) {
                nextState[0].output[action.channelIndex].webState =
                    action.webState
            }
            break
        case IO.SET_MANUAL_START:
            if (doesChannelExist(nextState, action)) {
                nextState[0].output[action.channelIndex].manualstartState =
                    action.manualstartState
            }
            break
        case IO.SET_TIME:
            if (doesChannelExist(nextState, action)) {
                nextState[0].output[action.channelIndex].time = action.time
            }
            break
        case IO.SET_VISIBILITY:
            if (doesChannelExist(nextState, action)) {
                nextState[0].output[action.channelIndex].visibilityState =
                    action.visibility
            }
            break
    }

    return nextState
}

function doesChannelExist(nextState: any, action: any) {
    return nextState[0].output.length >= action.channelIndex
}
