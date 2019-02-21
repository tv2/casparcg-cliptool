import { combineReducers } from 'redux';
import { settings } from './settingsReducer';
import { appNavReducer } from './appNavReducer';
import { data } from './dataReducer';

const indexReducer = combineReducers({
    data,
    settings,
    appNavReducer
});

export default indexReducer;
