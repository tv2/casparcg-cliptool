import { combineReducers } from 'redux'
import { settings } from './settingsReducer'
import { appNav } from './appNavReducer'
import { channels } from './channelsReducer'
import { media } from './mediaReducer'

const indexReducer = combineReducers({
    channels,
    settings,
    appNav,
    media,
})

export default indexReducer
