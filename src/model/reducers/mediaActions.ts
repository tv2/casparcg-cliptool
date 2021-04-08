import { IMediaFile, IThumbFile } from './mediaReducer'

export const UPDATE_MEDIA_FILES = 'updateMediaFiles'
export const UPDATE_THUMB_IST = 'updateThumbList'
export const SET_TALLY_FILE_NAME = 'setTallyFileName'
export const SET_LOOP = 'setLoop'
export const SET_MIX = 'setMix'
export const SET_MANUAL_START = 'setManualStart'
export const SET_TIME = 'setTime'

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

export const setLoop = (channelIndex: number, loopState: boolean) => {
    return {
        type: SET_LOOP,
        channelIndex: channelIndex,
        loopState: loopState,
    }
}

export const setMix = (channelIndex: number, mixState: boolean) => {
    return {
        type: SET_MIX,
        channelIndex: channelIndex,
        mixState: mixState,
    }
}

export const setManualStart = (
    channelIndex: number,
    manualstartState: boolean
) => {
    return {
        type: SET_MANUAL_START,
        channelIndex: channelIndex,
        manualstartState: manualstartState,
    }
}

export const setTime = (channelIndex: number, time: [number, number]) => {
    return {
        type: SET_TIME,
        channelIndex: channelIndex,
        time: time,
    }
}
