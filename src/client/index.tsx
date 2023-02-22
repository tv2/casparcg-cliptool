import React from 'react'
import ReactDom from 'react-dom'

import { Provider as ReduxProvider } from 'react-redux'
import { reduxStore, reduxState } from '../model/reducers/store'
import { socket } from './util/SocketClientHandlers'
import { App } from './components/App'
import { setSelectView } from '../model/reducers/appNavAction'
import { AppNew } from './components/App/AppNew'

console.log('Redux initialized :', reduxState)
if (new URLSearchParams(window.location.search).get('textview') === '1') {
    reduxStore.dispatch(setSelectView(1))
}

console.log('Socket Initialized', socket)

ReactDom.render(
    <ReduxProvider store={reduxStore}>
        <App />
        {/* <AppNew />  */}
    </ReduxProvider>,
    document.getElementById('root')
)
