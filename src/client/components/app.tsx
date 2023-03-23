import React from 'react'
import { reduxStore } from '../../model/reducers/store'
import { setActiveTab } from '../../model/reducers/appNavAction'

import { OperationModeFooter } from './footer/operationModeFooter'
import Tabs from './tab/tabs'

import '../css/App.css'
import { useSelector } from 'react-redux'
import { Settings } from './settings/settings'
import { Thumbnail } from './thumbnail/thumbnail'
import Header from './header/header'
import { ReduxStateType } from '../../model/reducers/indexReducer'

const channel = new URLSearchParams(window.location.search).get('channel')
const specificChannel = channel ? parseInt(channel) || 0 : 0


export function App(): JSX.Element {
    const isSettingsOpen = useSelector((storeUpdate: ReduxStateType) => storeUpdate.appNav.showSettingsActive)

    function setOutput(tab: number): void {
        reduxStore.dispatch(setActiveTab(tab))
    }
    if (specificChannel) {
        setOutput(specificChannel - 1)
    }
    const mainArea = specificChannel ? <Thumbnail/> : <Tabs />

    return (
        <div className="App">
            <Header />
            <div className="App-body">
                {
                    isSettingsOpen ? <Settings /> : mainArea 
                }
            </div>
            <OperationModeFooter />
        </div>
    )
}
