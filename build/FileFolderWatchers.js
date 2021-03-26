'use strict'
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              Object.defineProperty(o, k2, {
                  enumerable: true,
                  get: function () {
                      return m[k]
                  },
              })
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              o[k2] = m[k]
          })
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, 'default', {
                  enumerable: true,
                  value: v,
              })
          }
        : function (o, v) {
              o['default'] = v
          })
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod
        var result = {}
        if (mod != null)
            for (var k in mod)
                if (
                    k !== 'default' &&
                    Object.prototype.hasOwnProperty.call(mod, k)
                )
                    __createBinding(result, mod, k)
        __setModuleDefault(result, mod)
        return result
    }
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod }
    }
Object.defineProperty(exports, '__esModule', { value: true })
exports.templateFolderWatchSetup = exports.dataFolderWatchSetup = exports.mediaFolderWatchSetup = exports.mediaFileWatchSetup = void 0
const chokidar_1 = __importDefault(require('chokidar')) //Used to watch filesystem for changes
const DEFAULTS = __importStar(require('./utils/CONSTANTS'))
const getFolderStructure_1 = require('./utils/getFolderStructure')
require('./global')
//Follow media directories and pubsub if changes occour:
const mediaFileWatchSetup = (folder, pubsub) => {
    chokidar_1.default
        .watch(folder, { ignored: /(^|[\/\\])\../ })
        .on('all', (event, path) => {
            setTimeout(() => {
                pubsub.publish(DEFAULTS.PUBSUB_MEDIA_FILE_CHANGED, {
                    mediaFilesChanged: true,
                })
                console.log('Media Files Changes :', event, path)
            }, 10)
        })
        .on('ready', () => {
            console.log('Media Files Watch Ready ')
        })
        .on('error', (event, path) => {
            console.log('Media Files Watch Error:', event, path)
        })
}
exports.mediaFileWatchSetup = mediaFileWatchSetup
//Follow media directories and update mediaFolders if changes occour:
const mediaFolderWatchSetup = (folder) => {
    chokidar_1.default
        .watch(folder, { ignored: /(^|[\/\\])\../ })
        .on('all', (event, path) => {
            global.mediaFolders = getFolderStructure_1.getFolders(folder)
        })
        .on('ready', () => {
            console.log('Media Folder "', folder, '" Watch Ready ')
        })
        .on('error', (event, path) => {
            console.log('Media Folder Watch Error:', event, path)
        })
}
exports.mediaFolderWatchSetup = mediaFolderWatchSetup
//Follow data directories and update mediaFolders if changes occour:
const dataFolderWatchSetup = (folder) => {
    chokidar_1.default
        .watch(folder, { ignored: /(^|[\/\\])\../ })
        .on('all', (event, path) => {
            global.dataFolders = getFolderStructure_1.getFolders(folder)
        })
        .on('ready', () => {
            console.log('Data Folder "', folder, '" Watch Ready ')
        })
        .on('error', (event, path) => {
            console.log('Data Folder Watch Error:', event, path)
        })
}
exports.dataFolderWatchSetup = dataFolderWatchSetup
//Follow template directories and update mediaFolders if changes occour:
const templateFolderWatchSetup = (folder) => {
    chokidar_1.default
        .watch(folder, { ignored: /(^|[\/\\])\../ })
        .on('all', (event, path) => {
            global.templateFolders = getFolderStructure_1.getFolders(folder)
        })
        .on('ready', () => {
            console.log('Template Folder "', folder, '" Watch Ready ')
        })
        .on('error', (event, path) => {
            console.log('Template Folder Watch Error:', event, path)
        })
}
exports.templateFolderWatchSetup = templateFolderWatchSetup
//# sourceMappingURL=FileFolderWatchers.js.map
