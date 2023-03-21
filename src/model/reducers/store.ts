import { createStore } from 'redux'
import indexReducer from './indexReducer'

let storeRedux = createStore(indexReducer)

//Subscribe to redux store:
let reduxState = storeRedux.getState()
storeRedux.subscribe(() => {
    reduxState = storeRedux.getState()
})

export { storeRedux as reduxStore }
export { reduxState as reduxState }
export type ReduxStateType = typeof reduxState
