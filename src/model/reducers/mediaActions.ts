import { IMediaFile, IThumbFile } from './mediaReducer'
export const UPDATE_MEDIA_FILES = 'updateMediaFiles'
export const UPDATE_THUMB_IST = 'updateThumbList'

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
