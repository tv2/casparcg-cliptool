import React from 'react'
import { Tabs } from 'rmc-tabs'
import { reduxStore, reduxState } from '../../model/reducers/store'
import { useSelector } from 'react-redux'

// Components:
import { Thumbnail } from './Thumbnail'

//CSS files:
import '../css/Rmc-tabs.css'
import '../css/App.css'
import { setActiveTab } from '../../model/reducers/appNavAction'
import { RenderFullHeader } from './Header'
import { Footer } from './Footer/Footer'

const channel = new URLSearchParams(window.location.search).get('channel')
const specificChannel = parseInt(channel) || 0

export const App = () => {
    const setOutput = (tab: number) => {
        reduxStore.dispatch(setActiveTab(tab))
    }
    if (specificChannel) {
        setOutput(specificChannel - 1)
        return (
            <div className="App">
                <RenderFullHeader />
                <div className="App-body">
                    <div className="App-intro" key={specificChannel - 1}>
                        <Thumbnail />
                    </div>
                </div>
                <Footer />
            </div>
        )
    } else {
        return (
            <div className="App">
                <RenderFullHeader />
                <div className="App-body">
                    { /* @ts-ignore */}
                    <Tabs
                        tabs={reduxState.settings[0].tabData}
                        onChange={(tab, index) => setOutput(index)}
                    >
                        {renderTabData()}
                    </Tabs>
                </div>
                <Footer />
            </div>
        )
    }
}

const renderTabData = () => {
    // Redux hook:
    useSelector((storeUpdate: any) => storeUpdate.settings[0].tabData)

    return reduxState.settings[0].tabData.map((item, index) => {
        return (
            <div className="App-intro" key={index}>
                <Thumbnail />
            </div>
        )
    })
}
