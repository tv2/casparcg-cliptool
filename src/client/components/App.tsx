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

export const App = () => {
    const setOutput = (tab: number) => {
        reduxStore.dispatch(setActiveTab(tab))
    }

    return (
        <div className="App">
             <RenderFullHeader />
            <div className="App-body">
                <Tabs
                    tabs={reduxState.settings[0].tabData}
                    onChange={(tab, index) => setOutput(index)}
                >
                    {renderTabData()}
                </Tabs>
            </div>
        </div>
    )
}

const renderTabData = () => {
    // Redux hook:
    useSelector(
        (storeUpdate: any) => storeUpdate.settings[0].tabData
    )
    return (
            reduxState.settings[0].tabData.map((item, index) => {
                return (
                    <div className="App-intro" key={index}>
                        <Thumbnail />
                    </div>
                )
            })
    )
}
