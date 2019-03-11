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

export const saveSettings = (settings) => {
    const folder = electron.remote.app.getPath('userData');
    var json = JSON.stringify(settings);
    fs.writeFile(folder + "/settings.json", json, 'utf8', (error)=>{
        console.log(error);
    });
};

export const loadThumbsOrder = (ccgServer) => {
    ccgServer.dataRetrieve("cliptoolthumbsorder")
    .then((response) => {
        let thumbsOrder = JSON.parse(response.response.data);
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
