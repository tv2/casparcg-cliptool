import { combineReducers } from 'redux';
import { settingsReducer } from './settingsReducer';
import { appNavReducer } from './appNavReducer';
import { dataReducer } from './dataReducer';
import { templateDataReducer } from './templateDataReducer';

const indexReducer = combineReducers({
    dataReducer,
    settingsReducer,
    appNavReducer,
    templateDataReducer
});

export default indexReducer;
