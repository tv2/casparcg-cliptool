import React from 'react'
import { reduxStore, reduxState } from '../../model/reducers/store'

// Components:
import { setActiveTab } from '../../model/reducers/appNavAction'
import { RenderFullHeader } from './Header'
import { Footer } from './Footer'
import Tabs from './Tab/Tabs'
import TabItem from './Tab/TabItem'

//CSS files:
import '../css/App.css'

const channel = new URLSearchParams(window.location.search).get('channel')
const specificChannel = parseInt(channel) || 0

export const App = () => {
    const setOutput = (tab: number) => {
        reduxStore.dispatch(setActiveTab(tab))
    }
    if (specificChannel) {
        setOutput(specificChannel - 1)
    }    
    return (
        <div className="App">
            <RenderFullHeader />
            <div className="App-body">
                {
                    specificChannel 
                    ? <TabItem index={specificChannel - 1}/> 
                    : <Tabs />
                }
            </div>
            <Footer />
        </div>
    )
}