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
    mediaFiles: IMediaFile[]
    thumbnailList: IThumbFile[]
    tallyFile: string[]
    loop: boolean[]
}

const defaultMediaState = (): Array<IMedia> => {
    return [
        {
            mediaFiles: [],
            thumbnailList: [],
            tallyFile: [],
            loop: [],
        },
    ]
}

export const media = (state: Array<IMedia> = defaultMediaState(), action) => {
    let nextState = { ...state }

    switch (action.type) {
        case IO.UPDATE_MEDIA_FILES:
            nextState[0].mediaFiles = action.files
            return nextState
        case IO.UPDATE_THUMB_IST:
            nextState[0].thumbnailList = action.fileList
            return nextState
        case IO.SET_TALLY_FILE_NAME:
            nextState[0].tallyFile[action.channelIndex] = action.filename
            return nextState
        case IO.SET_LOOP:
            nextState[0].loop[action.channelIndex] = action.loop
            return nextState
        default:
            return nextState
    }
}
