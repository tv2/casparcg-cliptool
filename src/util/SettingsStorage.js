
const fs = require('fs');
const electron = require('electron');


export const loadSettings = (storeRedux) => {
    const folder = electron.remote.app.getPath('userData');
    var settingsInterface = storeRedux.settingsReducer[0].settings;
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
}



