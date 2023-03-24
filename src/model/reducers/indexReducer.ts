import { settings } from './settingsReducer'
import { media } from './mediaReducer'
import { combineReducers } from '@reduxjs/toolkit'
import { appNavigation } from './app-navigation-reducer'

const indexReducer = combineReducers({
    settings,
    appNavigation,
    media,
})
export type ReduxStateType = ReturnType<typeof indexReducer>
export default indexReducer
