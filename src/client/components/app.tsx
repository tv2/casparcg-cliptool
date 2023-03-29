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

const channel = new URLSearchParams(window.location.search).get('channel')
const specificChannel = channel ? parseInt(channel) || 0 : 0


export function App(): JSX.Element {
    const isSettingsOpen = useSelector((storeUpdate: State) => storeUpdate.appNavigation.showSettingsActive)
    
    if (specificChannel) {
        setOutput(specificChannel - 1)
    }   

    return (
        <div className="App">
            <Header />
            <div className="App-body">
                {
                    isSettingsOpen ? <Settings /> : <Main specificChannel={specificChannel}/> 
                }
            </div>
            <OperationModeFooter />
        </div>
    )
}

function setOutput(tab: number): void {
    reduxStore.dispatch(setActiveTab(tab))
}