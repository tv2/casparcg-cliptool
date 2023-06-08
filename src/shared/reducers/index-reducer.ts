import { settings } from './settings-reducer'
import { media } from './media-reducer'
import { combineReducers } from '@reduxjs/toolkit'
import { appNavigation } from './app-navigation-reducer'

const indexReducer = combineReducers({
    settings,
    appNavigation,
    media,
})
export type State = ReturnType<typeof indexReducer>
export default indexReducer
