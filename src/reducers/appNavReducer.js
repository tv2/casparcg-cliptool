const defaultAppNavReducerState = [{
    appNav: {
        settings_window: false
    }
}];

export const appNavReducer = ((state = defaultAppNavReducerState, action) => {

    let { ...nextState } = state;

    switch(action.type) {
        case 'SET_SETTINGS_WINDOW':
            nextState[0].appNav.settings_window = action.data;
            return nextState;
        default:
            return nextState;
    }
});
