const defaultSettingsReducerState = [{
    settings: {
        ipAddress: 'localhost',
        port: '5250',
        tabData: [
            { key: 1, title: 'SCREEN 1', subFolder: '', loop: false, autoPlay: false, overlayFolder: '', wipe: '', wipeOffset: 0.0},
            { key: 2, title: 'SCREEN 2', subFolder: '', loop: false, autoPlay: false, overlayFolder: '', wipe: '', wipeOffset: 0.0},
            { key: 3, title: 'SCREEN 3', subFolder: '', loop: false, autoPlay: false, overlayFolder: '', wipe: '', wipeOffset: 0.0},
            { key: 4, title: 'SCREEN 4', subFolder: '', loop: false, autoPlay: false, overlayFolder: '', wipe: '', wipeOffset: 0.0}
        ]
    }
}];

export const settingsReducer = ((state = defaultSettingsReducerState, action) => {
    let { ...nextState } = state;

    switch(action.type) {
        case 'UPDATE_SETTINGS':
            nextState[0].settings.ipAddress = action.data.ipAddress;
            nextState[0].settings.port = action.data.port;
            nextState[0].settings.tabData.map((item, index) => {
                nextState[0].settings.tabData[index].title = action.data.tabData[index].title || '';
                nextState[0].settings.tabData[index].subFolder = action.data.tabData[index].subFolder || '';
                nextState[0].settings.tabData[index].loop = action.data.tabData[index].loop || false;
                nextState[0].settings.tabData[index].autoPlay = action.data.tabData[index].autoPlay || false;
                nextState[0].settings.tabData[index].overlayFolder = action.data.tabData[index].overlayFolder || '';
                nextState[0].settings.tabData[index].wipe = action.data.tabData[index].wipe || '';
                nextState[0].settings.tabData[index].wipeOffset = action.data.tabData[index].wipeOffset || 0.0;
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
