import { secondsToTimeCode } from '../util/TimeCodeToString';

const defaultDataReducerState = [{
    data: {
        ccgInfo: {},
        ccgTimeLeft: [0 , 0, 0, 0],
        ccgTime: [0 , 0, 0, 0],
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
            action.data.timeLeft.map((item, index) => {
                nextState[0].data.ccgTimeLeft[index] = item.timeLeft;
                nextState[0].data.ccgTime[index] = item.time;
                nextState[0].data.ccgTimeCounter[index] = secondsToTimeCode(item.timeLeft);
            });
            return nextState;
        case 'SET_THUMB_LENGTH':
            if (action.data.length < nextState[0].data.channel[action.data.tab].thumbList.length) {
                nextState[0].data.channel[action.data.tab].thumbList.length = action.data.length;
            }
            return nextState;
        case 'SET_THUMB_LIST':
            if (action.data.index <= (nextState[0].data.channel[action.data.tab].thumbList.length-1)) {
                nextState[0].data.channel[action.data.tab].thumbList[action.data.index] = action.data.thumbList;
            } else {
                nextState[0].data.channel[action.data.tab].thumbList.push(action.data.thumbList);
            }
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
            //Reset old Tally:
            if (nextState[0].data.channel[action.data.tab].thumbActiveIndex <
                nextState[0].data.channel[action.data.tab].thumbList.length)
            {
                nextState[0].data.channel[action.data.tab].thumbList[nextState[0].data.channel[action.data.tab].thumbActiveIndex].tally = false;
            }
            //Set new tally:
            nextState[0].data.channel[action.data.tab].thumbList[action.data.thumbActiveIndex].tally = true;
            nextState[0].data.channel[action.data.tab].thumbActiveIndex = action.data.thumbActiveIndex;
            return nextState;
        case 'SET_THUMB_ACTIVE_BG_INDEX':
            //Reset old Bg Tally:
            if (nextState[0].data.channel[action.data.tab].thumbActiveBgIndex <
                nextState[0].data.channel[action.data.tab].thumbList.length)
            {
                nextState[0].data.channel[action.data.tab].thumbList[nextState[0].data.channel[action.data.tab].thumbActiveBgIndex].tallyBg = false;
            }
            //Set new Bg Tally:
            nextState[0].data.channel[action.data.tab].thumbList[action.data.thumbActiveBgIndex].tallyBg = true;
            nextState[0].data.channel[action.data.tab].thumbActiveBgIndex = action.data.thumbActiveBgIndex;
            return nextState;
        default:
            return nextState;
    }
});
