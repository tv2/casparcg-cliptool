import { UPDATE_MEDIA_FILES, UPDATE_THUMB_IST } from './mediaActions'

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
}

export interface IMedia {
    mediaFiles: IMediaFile[]
    thumbnailList: IThumbFile[]
}

const defaultMediaState = (): IMedia => {
    return {
        mediaFiles: [],
        thumbnailList: [],
    }
}

export const media = (state = defaultMediaState(), action) => {
    let { ...nextState } = state

    switch (action.type) {
        case UPDATE_MEDIA_FILES:
            nextState.mediaFiles = action.files
            return nextState
        case UPDATE_THUMB_IST:
            nextState.thumbnailList = action.fileList
            return nextState
        default:
            return nextState
    }
}
