import { combineReducers } from 'redux';
import { settings } from './settingsReducer';
import { appNav } from './appNavReducer';
import { data } from './dataReducer';

const indexReducer = combineReducers({
    data,
    settings,
    appNav
});

export default indexReducer;
