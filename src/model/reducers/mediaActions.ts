export const UPDATE_MEDIA_FILES = 'updateMediaFiles'

export const updateMediaFiles = (fileList: string[]) => {
    return {
        type: UPDATE_MEDIA_FILES,
        files: fileList,
    }
}
