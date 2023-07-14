import React from 'react'
import { reduxStore } from '../../shared/store'
import { setActiveTabIndex } from '../../shared/actions/app-navigation-action'
import './app.scss'
import ApplicationRouter from '../shared/components/application-router/application-router'
import { BrowserService } from '../shared/services/browser-service'


export function App(): JSX.Element {
    const browserService = new BrowserService()
    if (browserService.isChannelView()) {
        setOutput(browserService.getChannel())
    }
    return (
        <div className="app">
            <ApplicationRouter/>
        </div>
    )
}

function setOutput(tabIndex: number): void {
    reduxStore.dispatch(setActiveTabIndex(tabIndex))
}