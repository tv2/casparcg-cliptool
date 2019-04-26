import CcgLoadPlay from './CcgLoadPlay';

const fs = require('fs');
const electron = require('electron');


export const loadSettings = (storeRedux) => {
    const folder = electron.remote.app.getPath('userData');
    var settingsInterface = storeRedux.settings[0];
    try {
        const settingsFromFile = JSON.parse(fs.readFileSync(folder + "/settings.json"));
        console.log("File Loaded : ", settingsFromFile);
        return (settingsFromFile);
    }
    catch (error) {
        saveSettings(settingsInterface);
        return (settingsInterface);
    }
};

export const saveSettings = (settings, ccgServer) => {
    const folder = electron.remote.app.getPath('userData');
    var json = JSON.stringify(settings);
    fs.writeFile(folder + "/settings.json", json, 'utf8', (error)=>{
        console.log(error);
    });
    if (ccgServer != undefined) {
        saveCommonSettings(settings, ccgServer);
        console.log("Storing Common Settings on server");
    }
};

export const loadClipToolCommonrSettings = (ccgServer, settings, settingsMenuActive) => {
    loadClipToolThumbOrder(ccgServer);
    if (settingsMenuActive) {
        return;
    }
    let nextSettings = JSON.parse(JSON.stringify(settings));
    ccgServer.dataRetrieve("cliptoolsettings")
    .then((data) => {
        nextSettings[0].tabData = JSON.parse(data.response.data).tabData;
        window.store.dispatch({
            type:'UPDATE_SETTINGS',
            data: nextSettings[0]
        });
    })
    .catch((error) => {
        let store = window.store.getState();
        console.log("Creating Settings file on CCG server", error);
        ccgServer.dataStore('cliptoolsettings', store.settings[0]);
    });
};

export const loadClipToolThumbOrder = (ccgServer) => {
    ccgServer.dataRetrieve("cliptoolthumbsorder")
    .then((data) => {
        let thumbsOrder = JSON.parse(data.response.data);
        thumbsOrder.map((thumbOrder, index) => {
            window.store.dispatch({
                type:'SET_THUMB_ORDER',
                channel: index +1,
                list: thumbOrder.list
            });
        });
    })
    .catch((error) => {
        let store = window.store.getState();
        console.log("Creating ThumbsOrder file on CCG server", error);
        ccgServer.dataStore('cliptoolthumbsorder', store.data[0].thumbOrder);
    });
};

export const saveThumbsOrder = (ccgServer, serverThumbsOrder) => {
    ccgServer.dataStore('cliptoolthumbsorder', serverThumbsOrder);
};

const saveCommonSettings = (settings, ccgServer) => {
    ccgServer.dataStore('cliptoolsettings', settings);
}
