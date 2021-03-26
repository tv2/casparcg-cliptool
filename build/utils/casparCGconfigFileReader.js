'use strict'
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod }
    }
Object.defineProperty(exports, '__esModule', { value: true })
exports.readCasparCgConfigFile = void 0
const fs_1 = __importDefault(require('fs')) // Used for reading casparcg.config file
const xml_js_1 = __importDefault(require('xml-js'))
const readCasparCgConfigFile = () => {
    //Read casparcg settingsfile (place a copy of it in this folder if stacanner is not installed in server folder)
    let data = String(fs_1.default.readFileSync('casparcg.config'))
    if (data === '') {
        data = '<channel></channel>'
    }
    return xml_js_1.default.xml2js(data, {
        ignoreComment: true,
        alwaysChildren: true,
        compact: true,
    })
}
exports.readCasparCgConfigFile = readCasparCgConfigFile
//# sourceMappingURL=casparCGconfigFileReader.js.map
