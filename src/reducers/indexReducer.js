import { combineReducers } from 'redux';
import { settingsReducer } from './settingsReducer';
import { appNavReducer } from './appNavReducer';
import { dataReducer } from './dataReducer';

const indexReducer = combineReducers({
    dataReducer,
    settingsReducer,
    appNavReducer
});

export default indexReducer;
