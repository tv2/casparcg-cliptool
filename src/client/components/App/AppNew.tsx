import React from 'react'
import { reduxStore, reduxState } from '../../../model/reducers/store'
import { useSelector } from 'react-redux'

// Components:
import { Thumbnail } from '../Thumbnail'

//CSS files:
import '../../css/App.css'
import { setActiveTab } from '../../../model/reducers/appNavAction'
import { RenderFullHeader } from '../Header'
import { Footer } from '../Footer'
import Tabs from '../Tab/Tabs'
import TabItem from '../Tab/TabItem'

const channel = new URLSearchParams(window.location.search).get('channel')
const specificChannel = parseInt(channel) || 0

export const AppNew = () => {
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