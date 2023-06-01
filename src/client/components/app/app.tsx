import React from 'react'
import { reduxStore } from '../../../model/reducers/store'
import { setActiveTabIndex } from '../../../model/reducers/app-navigation-action'
import { OperationModeFooter } from '../footer/operation-mode-footer'
import ApplicationHeader from '../header/application-header/application-header'
import browserService from '../../services/browser-service'
import './app.scss'
import ApplicationRouter from '../application-router/application-router'


export function App(): JSX.Element {
    if (browserService.isChannelView()) {
        setOutput(browserService.getChannel())
    }
    return (
        <div className="app">
            <ApplicationHeader />
            <ApplicationRouter/>
            <OperationModeFooter />
        </div>
    )
}

function setOutput(tabIndex: number): void {
    reduxStore.dispatch(setActiveTabIndex(tabIndex))
}