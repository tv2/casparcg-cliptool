import { combineReducers } from 'redux'
import { settings } from './settingsReducer'
import { appNav } from './appNavReducer'
import { media } from './mediaReducer'

const indexReducer = combineReducers({
    settings,
    appNav,
    media,
})

export default indexReducer
