import React from 'react'
import { Tabs } from 'rmc-tabs'
import { reduxStore, reduxState } from '../../model/reducers/store'
import { shallowEqual, useSelector } from 'react-redux'


// Components:
import { Thumbnail } from './Thumbnail'

//Utils:
import HandleShortcuts from '../util/HandleShortcuts'

//CSS files:
import '../css/Rmc-tabs.css'
import '../css/App.css'
import {
    setActiveTab,
} from '../../model/reducers/appNavAction'
import { RenderFullHeader, RenderTextViewHeader } from './Header'

export const App = () => {
    // Redux hook:
    const store = useSelector((storeUpdate) => storeUpdate, shallowEqual)


    const setOutput = (tab: number) => {
        reduxStore.dispatch(setActiveTab(tab))
    }

    //Rendering functions:


    const renderTabData = () => {
        return reduxState.settings[0].tabData.map((item) => {
            return (
                <div className="App-intro" key={item.key}>
                    <Thumbnail />
                </div>
            )
        })
    }

    return (
        <div className="App">
            {reduxState.appNav[0].selectView === 0 ? <RenderFullHeader /> : ''}
            {reduxState.appNav[0].selectView === 1 ? (
                <RenderTextViewHeader />
            ) : (
                ''
            )}
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
