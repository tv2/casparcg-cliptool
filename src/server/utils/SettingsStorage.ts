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
    if (ccgServer != undefined) {
        saveCommonSettings(settings, ccgServer)
        console.log('Storing Common Settings on server')
    }
}

export const loadClipToolCommonSettings = (
    ccgServer,
    settings,
    settingsMenuActive
) => {
    loadClipToolThumbOrder(ccgServer)
    if (settingsMenuActive) {
        return
    }
    let nextSettings = JSON.parse(JSON.stringify(settings))
    ccgServer
        .dataRetrieve('cliptoolsettings')
        .then((data) => {
            nextSettings[0].tabData = JSON.parse(data.response.data).tabData
            saveSettings(nextSettings[0], ccgServer)
            reduxStore.dispatch({
                type: 'UPDATE_SETTINGS',
                data: nextSettings[0],
            })
        })
        .catch((error) => {
            console.log('Creating Settings file on CCG server', error)
            ccgServer.dataStore('cliptoolsettings', reduxState.settings[0])
        })
}

export const loadClipToolThumbOrder = (ccgServer) => {
    ccgServer
        .dataRetrieve('cliptoolthumbsorder')
        .then((data) => {
            let thumbsOrder = JSON.parse(data.response.data)
            thumbsOrder.map((thumbOrder, index) => {
                reduxStore.dispatch({
                    type: 'SET_THUMB_ORDER',
                    channel: index + 1,
                    list: thumbOrder.list,
                })
            })
        })
        .catch((error) => {
            console.log('Creating ThumbsOrder file on CCG server', error)
            /*
            ccgServer.dataStore(
                'cliptoolthumbsorder',
                reduxState.data[0].thumbOrder
            )
            */
        })
}

export const saveThumbsOrder = (ccgServer, serverThumbsOrder) => {
    ccgServer.dataStore('cliptoolthumbsorder', serverThumbsOrder)
}

const saveCommonSettings = (settings, ccgServer) => {
    ccgServer.dataStore('cliptoolsettings', settings)
}
