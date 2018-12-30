const defaultDataReducerState = [{
    data: {
        ccgInfo: {},
        ccgTimeLeft: [0 , 0, 0, 0],
        activePvwPix: [],
        activePgmPix: [],
        channel: [{
            thumbList: [],
            thumbActiveIndex: 0,
            thumbActiveBgIndex: 0
        }]
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
        case 'ADD_THUMB_LIST':
            nextState[0].data.channel[action.data.tab].thumbList.push(action.data.thumbList);
            return nextState;
        case 'ADD_THUMB_PIX':
            nextState[0].data.channel[action.data.tab].thumbList[action.data.index].thumbPix = action.data.thumbPix;
            return nextState;
        case 'SET_THUMB_ACTIVE_INDEX':
            //Reset old Tally and set new:
            nextState[0].data.channel[action.data.tab].thumbList[nextState[0].data.channel[action.data.tab].thumbActiveIndex].tally = false;
            nextState[0].data.channel[action.data.tab].thumbList[action.data.thumbActiveIndex].tally = true;

            nextState[0].data.channel[action.data.tab].thumbActiveIndex = action.data.thumbActiveIndex;
            return nextState;
        case 'SET_THUMB_ACTIVE_BG_INDEX':
            //Reset Old BG Tally and set new:
            nextState[0].data.channel[action.data.tab].thumbList[nextState[0].data.channel[action.data.tab].thumbActiveBgIndex].tallyBg = false;
            nextState[0].data.channel[action.data.tab].thumbList[action.data.thumbActiveBgIndex].tallyBg = true;

            nextState[0].data.channel[action.data.tab].thumbActiveBgIndex = action.data.thumbActiveBgIndex;
            return nextState;
        default:
            return nextState;
    }
});
