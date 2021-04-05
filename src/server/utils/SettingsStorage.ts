import { reduxStore, reduxState } from '../../model/reducers/store'

const fs = require('fs')

export const loadSettings = (storeRedux) => {
    //const folder = electron.remote.app.getPath('userData');
    var settingsInterface = storeRedux.settings[0]
    try {
        const settingsFromFile = JSON.parse(fs.readFileSync('/settings.json'))
        console.log('File Loaded : ', settingsFromFile)
        return settingsFromFile
    } catch (error) {
        //        saveSettings(settingsInterface);
        return settingsInterface
    }
}

export const saveSettings = (settings, ccgServer) => {
    var json = JSON.stringify(settings)
    fs.writeFile('/settings.json', json, 'utf8', (error) => {
        console.log(error)
    })
}
