import { combineReducers } from 'redux';
import { settingsReducer } from './settingsReducer';
import { appNavReducer } from './appNavReducer';

const indexReducer = combineReducers({
    settingsReducer,
    appNavReducer,
});

export default indexReducer;
