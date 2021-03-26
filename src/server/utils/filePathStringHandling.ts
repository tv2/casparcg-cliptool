export const cleanUpFilename = (filename: string): string => {
    // casparcg-connection library bug: returns filename with media// or media/
    return filename
        .replace(/\\/g, '/')
        .replace('media//', '')
        .replace('media/', '')
        .toUpperCase()
        .replace(/\..+$/, '')
}

export const extractFilenameFromPath = (filename: string): string => {
    return filename.replace(/^.*[\\\/]/, '')
}
