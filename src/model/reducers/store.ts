import { configureStore } from '@reduxjs/toolkit'
import { ConfigureStoreOptions } from '@reduxjs/toolkit/dist/configureStore'
import indexReducer, { ReduxStateType } from './indexReducer'

const options: ConfigureStoreOptions = {
    reducer: indexReducer,
}

let reduxStore = configureStore(options)

//Subscribe to redux store:
let reduxState: ReduxStateType = reduxStore.getState()
reduxStore.subscribe(() => {
    reduxState = reduxStore.getState()
})

export { reduxStore as reduxStore }
export { reduxState as reduxState }
