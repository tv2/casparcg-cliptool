import React from 'react'
import { reduxStore } from '../../../model/reducers/store'
import { setActiveTab } from '../../../model/reducers/app-navigation-action'
import { OperationModeFooter } from '../footer/operation-mode-footer'
import Header from '../header/header/header'
import browserService from '../../services/browser-service'
import './app.scss'
import Body from '../body/body'


export function App(): JSX.Element {
    if (browserService.isChannelView()) {
        setOutput(browserService.getChannel())
    }
    return (
        <div className="app">
            <Header />
            <div className="app-body">
                <Body/>
            </div>
            <OperationModeFooter />
        </div>
    )
}

function setOutput(tabIndex: number): void {
    reduxStore.dispatch(setActiveTab(tabIndex))
}