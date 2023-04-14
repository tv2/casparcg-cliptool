import './css/index.scss'
import React from 'react'
import ReactDom from 'react-dom'

import { Provider as ReduxProvider } from 'react-redux'
import { reduxStore, state } from '../model/reducers/store'
import { App } from './components/app/app'
import clientHandlerService from './services/client-handler-service'

console.log('Redux initialized :', state)
console.log('Socket Initialized', clientHandlerService.getSocket())

ReactDom.render(
    <ReduxProvider store={reduxStore}>
        <App />
    </ReduxProvider>,
    document.getElementById('root')
)
