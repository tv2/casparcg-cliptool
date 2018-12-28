const defaultDataReducerState = [{
    data: {
        ccgInfo: {},
        ccgTimeLeft: [0 , 0, 0, 0],
        activePvwPix: [],
        activePgmPix: []
    }
}];

export const dataReducer = ((state = defaultDataReducerState, action) => {

    let { ...nextState } = state;

    switch(action.type) {
        case 'SET_INFO_CHANNEL':
            nextState[0].data.ccgInfo = action.data;
            return nextState;
        case 'SET_TIMELEFT':
            nextState[0].data.ccgTimeLeft = action.data;
            return nextState;
        case 'SET_PGM_PIX':
            nextState[0].data.activePgmPix[action.data.tab] = action.data.pix;
            return nextState;
        case 'SET_PVW_PIX':
            nextState[0].data.activePvwPix[action.data.tab] = action.data.pix;
            return nextState;
        default:
            return nextState;
    }
});
