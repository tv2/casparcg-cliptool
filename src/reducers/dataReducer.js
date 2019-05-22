import { secondsToTimeCode } from '../util/TimeCodeToString';
import { deepCloneCopy } from '../util/deepCloneObject';

//ToDo: Change numberOfChannels to a check from server
const numberOfChannels = 4;
const numberOfOverlays = 400;

const defaultDataReducerState = () => {
    let stateDefault = [{
        ccgInfo: [],
        ccgTimeLeft: [0 , 0, 0, 0],
        ccgTime: [0 , 0, 0, 0],
        ccgPrevTime: [0, 0, 0, 0],
        ccgTimeCounter: ['', '', '', ''],
        thumbOrder: [],
        channel: []
    }];
    let channel = {
        thumbList: [{
            name: 'none',
            path: 'none',
            thumbPix: '',
            tally: false,
            tallyBg: false,
            metaList: [{
                htmlCcgType: "XML", // "XML" or "INVOKE"
                templatePath: '',
                layer: 20,
                startTime: 0,
                duration: 0,
                elementActive: 0, //0=in que, 1=active, 2=done
                templateXmlData: [{
                    id: '',
                    type: '',
                    data: ''
                }],
                invokeStart: "",
                invokeEnd: ""
            }],
        }],
        thumbActiveIndex: 0,
        thumbActiveBgIndex: 0,
        overlayIsStarted: []
    };
    // Initialise overlayStatus for all layers
    for (let i=0; i<numberOfOverlays; i++) {
        channel.overlayIsStarted.push(false);
    }
    // Clone for each ccg channel
    for (let i=0; i<numberOfChannels; i++) {
        stateDefault[0].channel.push(deepCloneCopy(channel));
    }
    // Add Thumborder sorting
    for (let i=0; i<numberOfChannels; i++) {
        stateDefault[0].thumbOrder.push({list : []});
    }
    return stateDefault;
};

let lastTimeCounter = [0, 0, 0, 0];

export const data = ((state = defaultDataReducerState(), action) => {

    let { ...nextState } = state;

    switch(action.type) {
        case 'SET_INFO_CHANNEL':
            nextState[0].ccgInfo = action.data;
            return nextState;
        case 'SET_LAYER_10':
            action.data.playLayer.map((item,index) => {
                nextState[0].ccgInfo[index].layers[9] = item.layers[0];
            });
            return nextState;
        case 'SET_THUMB_ORDER':
            nextState[0].thumbOrder[action.channel-1].list = action.list || [];
            return nextState;
        case 'SET_TIMELEFT':
            action.data.timeLeft.map((item, index) => {
                //Test for media playing or paused
                //ToDo: paused should be correct from CCG statescanner,
                //but it does not show correctly with CCG 2.1.3
                nextState[0].ccgInfo[index].layers[9].foreground.paused = (state[0].ccgTime[index] === item.time) && (state[0].ccgPrevTime[index] === item.time);
                if (lastTimeCounter[index]++ === 5) {
                    nextState[0].ccgPrevTime[index] = state[0].ccgTime[index];
                    lastTimeCounter[index] = 0;
                }

                nextState[0].ccgTimeLeft[index] = item.timeLeft;
                nextState[0].ccgTime[index] = item.time;
                nextState[0].ccgTimeCounter[index] = secondsToTimeCode(item.timeLeft);
            });
            return nextState;
        case 'SET_MEDIA_PAUSED':
            nextState[0].ccgInfo[action.index].layers[9].foreground.paused = action.paused;
            return nextState;
        case 'SET_THUMB_LENGTH':
            if (action.data.length < nextState[0].channel[action.data.tab].thumbList.length) {
                nextState[0].channel[action.data.tab].thumbList.length = action.data.length;
                // Check if active thumb is out of range of new thumblist.
                if (nextState[0].channel[action.data.tab].thumbActiveIndex > (action.data.length - 1)) {
                    nextState[0].channel[action.data.tab].thumbActiveIndex = action.data.length - 1;
                }
                if (nextState[0].channel[action.data.tab].thumbActiveBgIndex > (action.data.length-1)) {
                    nextState[0].channel[action.data.tab].thumbActiveBgIndex = action.data.length - 1;
                }
            }
            return nextState;
        case 'SET_THUMB_LIST':
            if (action.data.index <= (nextState[0].channel[action.data.tab].thumbList.length-1)) {
                nextState[0].channel[action.data.tab].thumbList[action.data.index] = action.data.thumbList;
            } else {
                nextState[0].channel[action.data.tab].thumbList.push(action.data.thumbList);
            }
            nextState[0].channel[action.data.tab].thumbList[action.data.index].metaList = [];
            return nextState;
        case 'SET_THUMB_PIX':
            nextState[0].channel[action.data.tab].thumbList[action.data.index].thumbPix = action.data.thumbPix;
            return nextState;
        case 'SET_META_LIST':
            action.metaList.map(metaElement => metaElement.elementActive = 0);
            nextState[0].channel[action.tab].thumbList[action.index].metaList = action.metaList;
            return nextState;
        case 'SET_META_ELEMENT_ACTIVE': // tab, index (thumblist index), elementIndex, active
            nextState[0].channel[action.tab].thumbList[action.index].metaList[action.elementIndex].elementActive = action.active;
            return nextState;
        case 'SET_EMPTY_META':
            nextState[0].channel[action.tab].thumbList[action.index].metaList = [];
            return nextState;
        case 'SET_OVERLAY_IS_STARTED': // tab, layer, started
            nextState[0].channel[action.tab].overlayIsStarted[action.layer] = action.started;
            return nextState;
        case 'MOVE_THUMB_IN_LIST':
            const result = Array.from(nextState[0].channel[action.data.tab].thumbList);
            const [removed] = result.splice(action.data.source, 1);
            result.splice(action.data.destination, 0, removed);

            nextState[0].channel[action.data.tab].thumbList = result;
            return nextState;
        case 'SET_THUMB_ACTIVE_INDEX':
            //Reset old Tally:
            if (nextState[0].channel[action.data.tab].thumbActiveIndex <
                nextState[0].channel[action.data.tab].thumbList.length)
            {
                nextState[0].channel[action.data.tab].thumbList[nextState[0].channel[action.data.tab].thumbActiveIndex].tally = false;
            }
            //Set new tally:
            nextState[0].channel[action.data.tab].thumbList[action.data.thumbActiveIndex].tally = true;
            nextState[0].channel[action.data.tab].thumbActiveIndex = action.data.thumbActiveIndex;
            return nextState;
        case 'SET_THUMB_ACTIVE_BG_INDEX':
            //Reset old Bg Tally:
            if (nextState[0].channel[action.data.tab].thumbActiveBgIndex <
                nextState[0].channel[action.data.tab].thumbList.length)
            {
                nextState[0].channel[action.data.tab].thumbList[nextState[0].channel[action.data.tab].thumbActiveBgIndex].tallyBg = false;
            }
            //Set new Bg Tally:
            nextState[0].channel[action.data.tab].thumbList[action.data.thumbActiveBgIndex].tallyBg = true;
            nextState[0].channel[action.data.tab].thumbActiveBgIndex = action.data.thumbActiveBgIndex;
            return nextState;
        default:
            return nextState;
    }
});
