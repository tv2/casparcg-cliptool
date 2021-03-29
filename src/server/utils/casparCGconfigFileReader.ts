import fs from 'fs' // Used for reading casparcg.config file
import convert from 'xml-js'

export const readCasparCgConfigFile = (): any => {
    //Read casparcg settingsfile (place a copy of it in this folder if scanner is not installed in server folder)
    let data = '' // = String(fs.readFileSync('casparcg.config'))
    if (data === '') {
        data = '<channel></channel>'
    }
    return convert.xml2js(data, {
        ignoreComment: true,
        alwaysChildren: true,
        compact: true,
    })
}
