import { HiddenFileInfo, MediaFile, ThumbnailFile } from './mediaModels'

export const UPDATE_MEDIA_FILES = 'updateMediaFiles'
export const UPDATE_THUMBNAIL_LIST = 'updateThumbnailList'
export const UPDATE_FOLDER_LIST = 'updateFolderList'
export const UPDATE_HIDDEN_FILES = 'updateHiddenFiles'
export const SET_NUMBER_OF_OUTPUTS = 'setNumberOfOutputs'

export const SET_TIME = 'setTime'

export function updateMediaFiles(
    channelIndex: number,
    fileList: MediaFile[]
): { type: string; channelIndex: number; files: MediaFile[] } {
    return {
        type: UPDATE_MEDIA_FILES,
        channelIndex: channelIndex,
        files: fileList,
    }
}

export function updateFolderList(folderList: string[]): {
    type: string
    folderList: string[]
} {
    return {
        type: UPDATE_FOLDER_LIST,
        folderList: folderList,
    }
}

export function updateThumbnailFileList(
    channelIndex: number,
    fileList: ThumbnailFile[]
): { type: string; channelIndex: number; fileList: ThumbnailFile[] } {
    return {
        type: UPDATE_THUMBNAIL_LIST,
        channelIndex: channelIndex,
        fileList: fileList,
    }
}

export function updateHiddenFiles(
    hiddenFiles: Record<string, HiddenFileInfo>
): { type: string; hiddenFiles: Record<string, HiddenFileInfo> } {
    return {
        type: UPDATE_HIDDEN_FILES,
        hiddenFiles: hiddenFiles,
    }
}

export function setNumberOfOutputs(amount: number): {
    type: string
    amount: number
} {
    return {
        type: SET_NUMBER_OF_OUTPUTS,
        amount: amount,
    }
}

export function setTime(
    channelIndex: number,
    time: [number, number]
): { type: string; channelIndex: number; time: [number, number] } {
    return {
        type: SET_TIME,
        channelIndex: channelIndex,
        time: time,
    }
}
