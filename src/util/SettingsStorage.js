
const fs = require('fs');
const electron = require('electron');


export const loadSettings = (storeRedux) => {
    const folder = electron.remote.app.getPath('userData');
    var settingsInterface = storeRedux.settings[0];
    try {
        const settingsFromFile = JSON.parse(fs.readFileSync(folder + "/settings.json"));
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
                thumborder: thumbOrder
            });
        });
    })
    .catch((error) => {
        console.log("Creating ThumbsOrder file on CCG server", error);
        ccgServer.dataStore('cliptoolthumbsorder', [{}, {}, {}, {}]);
    });
};

export const saveThumbsOrder = (ccgServer, serverThumbsOrder) => {
    ccgServer.dataStore('cliptoolthumbsorder', serverThumbsOrder);
};
