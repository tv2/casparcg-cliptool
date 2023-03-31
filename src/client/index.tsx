import './css/index.css'
import React from 'react'
import ReactDom from 'react-dom'

import { Provider as ReduxProvider } from 'react-redux'
import { reduxStore, state } from '../model/reducers/store'
import { socket } from './util/socketClientHandlers'
import { App } from './components/app/app'

console.log('Redux initialized :', state)

console.log('Socket Initialized', socket)

ReactDom.render(
    <ReduxProvider store={reduxStore}>
        <App />
    </ReduxProvider>,
    document.getElementById('root')
)
