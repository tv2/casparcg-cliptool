import React from 'react'
import ReactDom from 'react-dom'

import { Provider as ReduxProvider } from 'react-redux'
import { reduxStore, reduxState } from '../model/reducers/store'
import { socket } from './util/SocketClientHandlers'
import { App } from './components/App'
import * as IO from '../model/SocketIoConstants'

console.log('Redux initialized :', reduxState)
socket.emit(IO.GET_SETTINGS)

ReactDom.render(
    <ReduxProvider store={reduxStore}>
        <App />
    </ReduxProvider>,
    document.getElementById('root')
)
