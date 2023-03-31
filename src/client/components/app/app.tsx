import React from 'react'
import { reduxStore } from '../../../model/reducers/store'
import { setActiveTab } from '../../../model/reducers/app-navigation-action'
import { OperationModeFooter } from '../footer/operation-mode-footer'
import { useSelector } from 'react-redux'
import { Settings } from '../settings/settings/settings'
import Header from '../header/header/header'
import { State } from '../../../model/reducers/index-reducer'
import Main from '../main'
import OfflineOverlay from '../offline-overlay/offline-overlay'
import jsxService from '../../services/jsx-service'
import browserService from '../../services/browser-service'
import './app.scss'


export function App(): JSX.Element {
    const isSettingsOpen = useSelector((state: State) => state.appNavigation.isSettingsOpen)
    const isConnected: boolean = useSelector(
        (state: State) => state.appNavigation.isConnected)
    if (browserService.isChannelView()) {
        setOutput(browserService.getChannel() - 1)
    }   

    return (
        <div className="app">
            <Header />
            <div className="app-body">
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