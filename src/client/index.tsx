import React from 'react'
import ReactDom from 'react-dom'

import { Provider as ReduxProvider } from 'react-redux'
import { reduxStore, reduxState } from '../model/reducers/store'
import { socket } from './util/socketClientHandlers'
import { App } from './components/app'
import { setSelectView } from '../model/reducers/app-navigation-action'

console.log('Redux initialized :', reduxState)
if (new URLSearchParams(window.location.search).get('textview') === '1') {
    reduxStore.dispatch(setSelectView(1))
}

console.log('Socket Initialized', socket)

ReactDom.render(
    <ReduxProvider store={reduxStore}>
        <App />
    </ReduxProvider>,
    document.getElementById('root')
)
