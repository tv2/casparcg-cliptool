import React from 'react'
import { ReduxStateType, reduxStore } from '../../model/reducers/store'
import { setActiveTab } from '../../model/reducers/appNavAction'

// Components:
import { OperationModeFooter } from './footer/operationModeFooter'
import Tabs from './tab/Tabs'

//CSS files:
import '../css/App.css'
import { useSelector } from 'react-redux'
import { Settings } from './settings/settings'
import { Thumbnail } from './thumbnail/thumbnail'
import Header from './header/header'

const channel = new URLSearchParams(window.location.search).get('channel')
const specificChannel = parseInt(channel) || 0

export function App(): JSX.Element {
    const isSettingsOpen = useSelector((storeUpdate: ReduxStateType) => storeUpdate.appNav[0].showSettingsActive)

    function setOutput(tab: number): void {
        reduxStore.dispatch(setActiveTab(tab))
    }
    if (specificChannel) {
        setOutput(specificChannel - 1)
    }
    return (
        <div className="App">
            <Header />
            <div className="App-body">
                {
                    isSettingsOpen 
                    ? <Settings /> 
                    : specificChannel 
                        ? <Thumbnail/> 
                        : <Tabs />
                }
            </div>
            <OperationModeFooter />
        </div>
    )
}
