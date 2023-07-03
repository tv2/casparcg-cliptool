import React from 'react'
import { reduxStore } from '../../../shared/store'
import { setActiveTabIndex } from '../../../shared/actions/app-navigation-action'
import { BrowserService } from '../../services/browser-service'
import './app.scss'
import ApplicationRouter from '../application-router/application-router'


export function App(): JSX.Element {
    if (new BrowserService().isChannelView()) {
        setOutput(new BrowserService().getChannel())
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