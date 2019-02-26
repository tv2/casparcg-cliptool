const defaultAppNavReducerState = [{
    connectionStatus: false,
    activeTab: 0,
}];

export const appNav = ((state = defaultAppNavReducerState, action) => {

    let { ...nextState } = state;

    switch(action.type) {
        case 'SET_ACTIVE_TAB':
            nextState[0].activeTab = action.data;
            return nextState;
        case 'SET_CONNECTION_STATUS':
            nextState[0].connectionStatus = action.data;
            return nextState;
        default:
            return nextState;
    }
});
