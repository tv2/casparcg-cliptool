import React from 'react'
import { reduxStore } from '../../model/reducers/store'
import { setActiveTab } from '../../model/reducers/app-navigation-action'

import { OperationModeFooter } from './footer/operation-mode-footer'

import '../css/App.css'
import { useSelector } from 'react-redux'
import { Settings } from './settings/settings'
import Header from './header/header'
import { State } from '../../model/reducers/index-reducer'

import Main from './main'
import OfflineOverlay from './offline-overlay'
import jsxService from '../services/jsx-service'
import browserService from '../services/browser-service'


export function App(): JSX.Element {
    const isSettingsOpen = useSelector((storeUpdate: State) => storeUpdate.appNavigation.showSettingsActive)
    const isConnected: boolean = useSelector(
        (storeUpdate: State) => storeUpdate.appNavigation.isConnected)
    const specificChannel = browserService.getChannel()
    if (browserService.isChannelView()) {
        setOutput(specificChannel - 1)
    }   

    return (
        <div className="App">
            <Header />
            <div className="App-body">
                {
                    jsxService.decideJsx(
                        !isConnected, 
                        <OfflineOverlay />, 
                        jsxService.decideJsx(
                            isSettingsOpen, 
                            <Settings />, 
                            <Main />)) 
                }
            </div>
            <OperationModeFooter />
        </div>
    )
}

function setOutput(tab: number): void {
    reduxStore.dispatch(setActiveTab(tab))
}