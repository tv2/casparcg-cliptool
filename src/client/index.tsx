import './css/index.scss'
import React from 'react'
import ReactDom from 'react-dom'

import { Provider as ReduxProvider } from 'react-redux'
import { App } from './components/app/app'

import { reduxStore, state } from '../shared/store'
import { BackendObserver } from './services/backend-observer'

console.log('Redux initialized :', state)
BackendObserver.instance.startBackendObserver()

ReactDom.render(
    <ReduxProvider store={reduxStore}>
        <App />
    </ReduxProvider>,
    document.getElementById('root')
)
