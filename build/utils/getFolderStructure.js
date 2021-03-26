'use strict'
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod }
    }
Object.defineProperty(exports, '__esModule', { value: true })
exports.getFolders = void 0
const filehound_1 = __importDefault(require('filehound'))
const getFolders = (path) => {
    let dirList = _getDirectories(path).map((dir) => {
        return { folder: dir.replace(path, '') }
    })
    return dirList
}
exports.getFolders = getFolders
function _getDirectories(path) {
    return filehound_1.default.create().path(path).directory().findSync()
}
//# sourceMappingURL=getFolderStructure.js.map
