import { createStore } from 'redux'
import indexReducer from './indexReducer'

let storeRedux = createStore(indexReducer)

//Subscribe to redux store:
let reduxState = storeRedux.getState()
const unsubscribe = storeRedux.subscribe(() => {
    reduxState = storeRedux.getState()
})

export { storeRedux as reduxStore }
export { reduxState as reduxState }
