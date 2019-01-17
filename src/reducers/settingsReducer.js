const defaultSettingsReducerState = [{
    settings: {
        ipAddress: 'localhost',
        port: '5250',
        mainFolder: '',
        tabData: [
            { key: 1, title: 'SCREEN 1', subFolder: '', loop: false, autoPlay: false, overlayFolder: ''},
            { key: 2, title: '', subFolder: '', loop: false, autoPlay: false, overlayFolder: ''},
            { key: 3, title: '', subFolder: '', loop: false, autoPlay: false, overlayFolder: ''},
            { key: 4, title: '', subFolder: '', loop: false, autoPlay: false, overlayFolder: ''},
            { key: 5, title: '', subFolder: '', loop: false, autoPlay: false, overlayFolder: ''},
            { key: 6, title: '', subFolder: '', loop: false, autoPlay: false, overlayFolder: ''},
        ]
    }
}];

export const settingsReducer = ((state = defaultSettingsReducerState, action) => {
    let { ...nextState } = state;

    switch(action.type) {
        case 'UPDATE_SETTINGS':
            nextState[0].settings.ipAddress = action.data.ipAddress;
            nextState[0].settings.port = action.data.port;
            nextState[0].settings.mainFolder = action.data.mainFolder;
            nextState[0].settings.tabData.map((item, index) => {
                nextState[0].settings.tabData[index].title = action.data.tabData[index].title || '';
                nextState[0].settings.tabData[index].subFolder = action.data.tabData[index].subFolder || '';
                nextState[0].settings.tabData[index].loop = action.data.tabData[index].loop || false;
                nextState[0].settings.tabData[index].autoPlay = action.data.tabData[index].autoPlay || false;
                nextState[0].settings.tabData[index].overlayFolder = action.data.tabData[index].overlayFolder || '';
            });
            return nextState;
        case 'LOOP_STATUS':
            nextState[0].settings.tabData[action.data].loop = !nextState[0].settings.tabData[action.data].loop;
            return nextState;
        case 'AUTOPLAY_STATUS':
        nextState[0].settings.tabData[action.data].autoPlay = !nextState[0].settings.tabData[action.data].autoPlay;
            return nextState;
        default:
            return nextState;
    }
});
