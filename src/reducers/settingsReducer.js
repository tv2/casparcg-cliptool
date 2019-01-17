const defaultSettingsReducerState = [{
    settings: {
        ipAddress: 'localhost',
        port: '5250',
        mainFolder: '',
        tabData: [
            { key: 1, title: 'SCREEN 1', subFolder: '', loop: false, autoPlay: false},
            { key: 2, title: '', subFolder: '', loop: false, autoPlay: false, overlay: false},
            { key: 3, title: '', subFolder: '', loop: false, autoPlay: false, overlay: false},
            { key: 4, title: '', subFolder: '', loop: false, autoPlay: false, overlay: false},
            { key: 5, title: '', subFolder: '', loop: false, autoPlay: false, overlay: false},
            { key: 6, title: '', subFolder: '', loop: false, autoPlay: false, overlay: false},
        ]
    }
}];

export const settingsReducer = ((state = defaultSettingsReducerState, action) => {
    let { ...nextState } = state;

    switch(action.type) {
        case 'UPDATE_SETTINGS':
            nextState[0].settings = action.data;
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
