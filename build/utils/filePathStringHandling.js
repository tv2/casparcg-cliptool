'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.extractFilenameFromPath = exports.cleanUpFilename = void 0
const cleanUpFilename = (filename) => {
    // casparcg-connection library bug: returns filename with media// or media/
    return filename
        .replace(/\\/g, '/')
        .replace('media//', '')
        .replace('media/', '')
        .toUpperCase()
        .replace(/\..+$/, '')
}
exports.cleanUpFilename = cleanUpFilename
const extractFilenameFromPath = (filename) => {
    return filename.replace(/^.*[\\\/]/, '')
}
exports.extractFilenameFromPath = extractFilenameFromPath
//# sourceMappingURL=filePathStringHandling.js.map
