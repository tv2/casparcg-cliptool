import { IMediaFile, IThumbFile } from './mediaReducer'
export const UPDATE_MEDIA_FILES = 'updateMediaFiles'
export const UPDATE_THUMB_IST = 'updateThumbList'
export const SET_TALLY_FILE_NAME = 'setTallyFileName'
export const SET_LOOP = 'setLoop'

export const updateMediaFiles = (fileList: IMediaFile[]) => {
    return {
        type: UPDATE_MEDIA_FILES,
        files: fileList,
    }
}

export const updateThumbFileList = (fileList: IThumbFile[]) => {
    return {
        type: UPDATE_THUMB_IST,
        fileList: fileList,
    }
}

export const setTallyFileName = (channelIndex: number, filename: string) => {
    return {
        type: SET_TALLY_FILE_NAME,
        channelIndex: channelIndex,
        filename: filename,
    }
}

export const setLoop = (channelIndex: number, loop: boolean) => {
    return {
        type: SET_LOOP,
        channelIndex: channelIndex,
        loop: loop,
    }
}
