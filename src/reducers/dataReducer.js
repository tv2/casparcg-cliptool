const defaultDataReducerState = [{
    data: {
        ccgInfo: {},
        ccgTimeLeft: [0 , 0, 0, 0],
        ccgTimeCounter: ['', '', '', ''],
        channel: [{
            thumbList: [{
                name: 'none',
                path: 'none',
                thumbPix: '',
                tally: false,
                tallyBg: false,
            }],
            thumbActiveIndex: 0,
            thumbActiveBgIndex: 0
        }]
    }
}];

const FPS = 25;

const secondsToTimeCode = (time => {
    if (time) {
        var hour = ('0' + (time/(60*60)).toFixed()).slice(-2);
        var minute = ('0' + (time/(60)).toFixed()).slice(-2);
        var sec = ('0' + parseFloat(time).toFixed()).slice(-2);
        var frm = ('0' + (100*(time - parseInt(time))*(FPS/100)).toFixed()).slice(-2);
    return (
        hour + "." + minute + "." + sec + "." + frm
    );
    } else {
        return "00.00.00.00";
    }
});


export const dataReducer = ((state = defaultDataReducerState, action) => {

    let { ...nextState } = state;

    switch(action.type) {
        case 'SET_INFO_CHANNEL':
            nextState[0].data.ccgInfo = action.data;
            return nextState;
        case 'SET_LAYER_10':
            action.data.playLayer.map((item,index) => {
                nextState[0].data.ccgInfo[index].layers[9] = item.layers[0];
            });
            return nextState;
        case 'SET_TIMELEFT':
            action.data.map((item, index) => {
                nextState[0].data.ccgTimeLeft[index] = item.timeLeft;
                nextState[0].data.ccgTimeCounter[index] = secondsToTimeCode(item.timeLeft);
            });
            return nextState;
        case 'SET_THUMB_LIST':
            nextState[0].data.channel[action.data.tab].thumbList[0] = action.data.thumbList;
            return nextState;
        case 'ADD_THUMB_LIST':
            nextState[0].data.channel[action.data.tab].thumbList.push(action.data.thumbList);
            return nextState;
        case 'SET_THUMB_PIX':
            nextState[0].data.channel[action.data.tab].thumbList[action.data.index].thumbPix = action.data.thumbPix;
            return nextState;
        case 'MOVE_THUMB_IN_LIST':
            const result = Array.from(nextState[0].data.channel[action.data.tab].thumbList);
            const [removed] = result.splice(action.data.source, 1);
            result.splice(action.data.destination, 0, removed);

            nextState[0].data.channel[action.data.tab].thumbList = result;
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
