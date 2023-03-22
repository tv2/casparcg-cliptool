import { settings } from './settingsReducer'
import { appNav } from './appNavReducer'
import { media } from './mediaReducer'
import { combineReducers } from '@reduxjs/toolkit'

const indexReducer = combineReducers({
    settings,
    appNav,
    media,
})
export type ReduxStateType = ReturnType<typeof indexReducer>
export default indexReducer
