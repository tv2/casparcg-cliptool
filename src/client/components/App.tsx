import React from 'react'
import { reduxStore } from '../../model/reducers/store'
import { setActiveTab } from '../../model/reducers/appNavAction'

// Components:
import { OperationModeFooter } from './Footer/OperationModeFooter'
import Tabs from './Tab/Tabs'

//CSS files:
import '../css/App.css'
import { useSelector } from 'react-redux'
import { SettingsPage } from './Settings/Settings'
import { Thumbnail } from './Thumbnail/Thumbnail'
import Header from './Header/Header'

const channel = new URLSearchParams(window.location.search).get('channel')
const specificChannel = parseInt(channel) || 0

export const App = () => {
    const isSettingsOpen = useSelector((storeUpdate: any) => storeUpdate.appNav[0].showSettingsActive)

    const setOutput = (tab: number) => {
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
                    ? <SettingsPage /> 
                    : specificChannel 
                        ? <Thumbnail/> 
                        : <Tabs />
                }
            </div>
            <OperationModeFooter />
        </div>
    )
}
