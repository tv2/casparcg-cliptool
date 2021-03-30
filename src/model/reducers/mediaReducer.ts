import { UPDATE_MEDIA_FILES } from './mediaActions'

interface IMediaFile {
    name: string
    type: string
    size: number
    changed: number
    frames: number
    frameTime: string
    frameRate: number
    duration: number
}

interface IThumbFile {
    name: string
    type: string
    changed: number
    size: number
}

interface IMedia {
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
        default:
            return nextState
    }
}
