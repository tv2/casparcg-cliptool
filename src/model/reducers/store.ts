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
let reduxState: State = reduxStore.getState()
reduxStore.subscribe(() => {
    reduxState = reduxStore.getState()
})

export { reduxStore as reduxStore }
export { reduxState as reduxState }
