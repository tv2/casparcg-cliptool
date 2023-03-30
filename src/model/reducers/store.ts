import { configureStore } from '@reduxjs/toolkit'
import { ConfigureStoreOptions } from '@reduxjs/toolkit/dist/configureStore'
import indexReducer, { State } from './index-reducer'

const options: ConfigureStoreOptions = {
    reducer: indexReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
}

let reduxStore = configureStore(options)

//Subscribe to redux store:
let state: State = reduxStore.getState()
reduxStore.subscribe(() => {
    state = reduxStore.getState()
})

export { reduxStore as reduxStore }
export { state as state }
