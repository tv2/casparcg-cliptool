
const defaultMetadataReducerState = [{
    data: {
        channel: [{
            metaList: [{
                template: '',
                startTime: 0,
                duration: 0,
                templateText: [{
                    key: '',
                    text: ''
                }]
            }]
        }]
    }
}];

/* CasparCG template data format:
<templateData>
  <componentData id="instance1">
    <data id="text" value="Text displayed in a CasparTextField" />
  </componentData>
  <componentData id="instance2">
    <data id="imagePath" value="d:/caspar/_TEMPLATEMEDIA/myImage.png" />
    <data id="alpha" value="0.6" />
  </componentData>
  <componentData id="customParameter1">
    <data id="data" value="true" />
  </componentData>
</templateData>
*/

export const dataReducer = ((state = defaultMetadataReducerState, action) => {

    let { ...nextState } = state;

    switch(action.type) {

        case 'SET_META_LENGTH':
            if (action.data.length < nextState[0].data.channel[action.data.tab].metaList.length) {
                nextState[0].data.channel[action.data.tab].metaList.length = action.data.length;
            }
            return nextState;
        case 'SET_META_LIST':
            if (action.data.index <= nextState[0].data.channel[action.data.tab].metaList.length) {
                nextState[0].data.channel[action.data.tab].metaList[action.data.index] = action.data.metaList;
            } else {
                nextState[0].data.channel[action.data.tab].metaList.push(action.data.metaList);
            }
            return nextState;

        default:
            return nextState;
    }
});
