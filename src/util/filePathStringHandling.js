
export const cleanUpFilename = (filename) => {
    // casparcg-connection library bug: returns filename with media// or media/
    return (filename.replace(/\\/g, '/')
        .replace('media//', '')
        .replace('media/', '')
        .toUpperCase()
        .replace(/\..+$/, '')
    );
};

export const extractFilenameFromPath = (filename) => {
    return filename.replace(/^.*[\\\/]/, '');
};

