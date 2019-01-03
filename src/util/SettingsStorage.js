
const fs = require('fs');
const electron = require('electron');


export const loadSettings = (storeRedux) => {
    const folder = electron.remote.app.getPath('userData');
    var settingsInterface = storeRedux.settingsReducer[0].settings;
    try {
        const settingsFromFile = JSON.parse(fs.readFileSync(folder + "/settings.json"));
        if (compareOldNewSettings(settingsFromFile, settingsInterface)) {
            settingsFromFile.tabData.map((item, index) => {
            item.loop = item.loop || false;
            item.autoPlay = item.autoPlay || false;
            });
            return (settingsFromFile);
        } else {
            return settingsInterface;
        }
    }
    catch (error) {
        return (settingsInterface);
    }
};

const compareOldNewSettings = (a, b) => {
    var aKeys = Object.keys(a).sort();
    var bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
};


export const saveSettings = (settings) => {
    const folder = electron.remote.app.getPath('userData');
    var json = JSON.stringify(settings);
    fs.writeFile(folder + "/settings.json", json, 'utf8', (error)=>{
        console.log(error);
    });
}



