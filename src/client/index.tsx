import './css/index.scss'
import React from 'react'
import ReactDom from 'react-dom'

import { Provider as ReduxProvider } from 'react-redux'
import { App } from './components/app/app'
import socketService from './services/socket-service'
import { reduxStore, state } from '../shared/store'

console.log('Redux initialized :', state)
console.log('Socket Initialized', socketService.getSocket())

ReactDom.render(
    <ReduxProvider store={reduxStore}>
        <App />
    </ReduxProvider>,
    document.getElementById('root')
)
