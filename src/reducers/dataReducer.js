import { secondsToTimeCode } from '../util/TimeCodeToString';
import { deepCloneCopy } from '../util/deepCloneObject';

//ToDo: Important!!! Change this to a check from server!!!!!
const numberOfChannels = 4;

const defaultDataReducerState = () => {
    let stateDefault = [{
        data: {
            ccgInfo: {},
            ccgTimeLeft: [0 , 0, 0, 0],
            ccgTime: [0 , 0, 0, 0],
            ccgPrevTime: [0, 0, 0, 0],
            ccgTimeCounter: ['', '', '', ''],
            channel: []
        }
    }];
    let channel = {
        thumbList: [{
            name: 'none',
            path: 'none',
            thumbPix: '',
            tally: false,
            tallyBg: false,
            metaList: [{
                templatePath: '',
                layer: 20,
                startTime: 0,
                duration: 0,
                templateData: [{
                    id: '',
                    type: '',
                    data: ''
                }]
            }],
        }],
        thumbActiveIndex: 0,
        thumbActiveBgIndex: 0
    };
    for (let i=0; i<numberOfChannels; i++) {
        stateDefault[0].data.channel.push(deepCloneCopy(channel));
    }
    return stateDefault;
};

const temp = defaultDataReducerState();
const emptyMetaList = temp[0].data.channel[0].thumbList[0].metaList;

let lastTimeCounter = 0;

export const dataReducer = ((state = defaultDataReducerState(), action) => {

    let nextState = deepCloneCopy(state);

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
                //Test for media playing or paused
                //ToDo: paused should be correct from CCG statescanner,
                //but it does not show correctly with CCG 2.1.3
                nextState[0].data.ccgInfo[index].layers[9].foreground.paused = (state[0].data.ccgTime[index] === item.time) && (state[0].data.ccgPrevTime[index] === item.time);
                if (lastTimeCounter++ === 5) {
                    nextState[0].data.ccgPrevTime[index] = state[0].data.ccgTime[index];
                    lastTimeCounter = 0;
                }

                nextState[0].data.ccgTimeLeft[index] = item.timeLeft;
                nextState[0].data.ccgTime[index] = item.time;
                nextState[0].data.ccgTimeCounter[index] = secondsToTimeCode(item.timeLeft);
            });
            return nextState;
        case 'SET_MEDIA_PAUSED':
            nextState[0].data.ccgInfo[action.index].layers[9].foreground.paused = action.paused;
            return nextState;
        case 'SET_THUMB_LENGTH':
            if (action.data.length < nextState[0].data.channel[action.data.tab].thumbList.length) {
                nextState[0].data.channel[action.data.tab].thumbList.length = action.data.length;
                // Check if active thumb is out of range of new thumblist.
                if (nextState[0].data.channel[action.data.tab].thumbActiveIndex > (action.data.length - 1)) {
                    nextState[0].data.channel[action.data.tab].thumbActiveIndex = action.data.length - 1;
                }
                if (nextState[0].data.channel[action.data.tab].thumbActiveBgIndex > (action.data.length-1)) {
                    nextState[0].data.channel[action.data.tab].thumbActiveBgIndex = action.data.length - 1;
                }
            }
            return nextState;
        case 'SET_THUMB_LIST':
            if (action.data.index <= (nextState[0].data.channel[action.data.tab].thumbList.length-1)) {
                nextState[0].data.channel[action.data.tab].thumbList[action.data.index] = action.data.thumbList;
            } else {
                nextState[0].data.channel[action.data.tab].thumbList.push(action.data.thumbList);
            }
            nextState[0].data.channel[action.data.tab].thumbList[action.data.index].metaList = emptyMetaList;
            return nextState;
        case 'SET_THUMB_PIX':
            nextState[0].data.channel[action.data.tab].thumbList[action.data.index].thumbPix = action.data.thumbPix;
            return nextState;
        case 'SET_META_LIST':
            nextState[0].data.channel[action.tab].thumbList[action.index].metaList = action.metaList;
            return nextState;
        case 'SET_EMPTY_META':
            nextState[0].data.channel[action.tab].thumbList[action.index].metaList = emptyMetaList;
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
