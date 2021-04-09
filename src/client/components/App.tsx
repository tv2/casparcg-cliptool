import React from 'react'
import { Tabs } from 'rmc-tabs'
import { reduxStore, reduxState } from '../../model/reducers/store'
import { useSelector } from 'react-redux'

import * as IO from '../../model/SocketIoConstants'

// Components:
import { Thumbnail, getThumb } from './Thumbnail'
import { SettingsPage } from './Settings'

//Utils:
import HandleShortcuts from '../util/HandleShortcuts'

//CSS files:
import '../css/Rmc-tabs.css'
import '../css/App.css'
import '../css/App-header.css'
import '../css/App-control-view-header.css'
import '../css/App-text-view-header.css'
import { socket } from '../util/SocketClientHandlers'
import { secondsToTimeCode } from '../util/TimeCodeToString'
import { setActiveTab, SET_ACTIVE_TAB, TOGGLE_SHOW_SETTINGS } from '../../model/reducers/appNavAction'

const MIX_DURATION = 6

export const App = () => {
    // Redux hook:
    const store = useSelector((store) => store)

    //Handler functions:
    const handleSettingsPage = () => {
        reduxStore.dispatch({
            type: TOGGLE_SHOW_SETTINGS,
        })
    }

    const handleLoopStatus = () => {
        socket.emit(
            IO.SET_LOOP_STATE,
            reduxState.appNav[0].activeTab,
            !reduxState.media[0].loopState[reduxState.appNav[0].activeTab]
        )
    }

    const handleMixStatus = () => {
        socket.emit(
            IO.SET_MIX_STATE,
            reduxState.appNav[0].activeTab,
            !reduxState.media[0].mixState[reduxState.appNav[0].activeTab]
        )
    }

    const handleManualStartStatus = () => {
        socket.emit(
            IO.SET_MANUAL_START_STATE,
            reduxState.appNav[0].activeTab,
            !reduxState.media[0].manualstartState[
                reduxState.appNav[0].activeTab
            ]
        )
    }

    const setOutput = (tab: number) => {
        reduxStore.dispatch(setActiveTab(tab))
    }

    const RenderTime = () => {
        return (
            <button className="App-header-pgm-counter">
                {secondsToTimeCode(reduxState.media[0].time[reduxState.appNav[0].activeTab])}
            </button>
        )
    }

    //Rendering functions:

    const RenderFullHeader = () => {
        return (
            <header className="App-header">
                <div className="App-reload-setup-background">
                    <label
                        className="App-connection-status"
                        style={
                            reduxState.appNav[0].connectionStatus
                                ? { backgroundColor: 'rgb(0, 128, 4)' }
                                : { backgroundColor: 'red' }
                        }
                    >
                        {reduxState.appNav[0].connectionStatus
                            ? 'VIEW'
                            : 'CONNECTING'}
                    </label>
                    <button
                        className="App-settings-button"
                        onClick={() => handleSettingsPage()}
                    >
                        SETTINGS
                    </button>
                </div>

                <div className="App-timer-background">
                    <img src={''} className="App-header-pvw-thumbnail-image" />
                    <RenderTime />
                    <img
                        src={getThumb(reduxState.media[0].tallyFile[reduxState.appNav[0].activeTab])}
                        className="App-header-pgm-thumbnail-image"
                    />
                </div>

                <div className="App-button-background">
                    <button
                        className="App-switch-button"
                        onClick={() => {
                            handleLoopStatus()
                        }}
                        style={
                            reduxState.media[0].loopState[
                                reduxState.appNav[0].activeTab
                            ]
                                ? { backgroundColor: 'rgb(28, 115, 165)' }
                                : { backgroundColor: 'grey' }
                        }
                    >
                        LOOP
                    </button>
                </div>

                <div className="App-button-background">
                    <button
                        className="App-switch-button"
                        onClick={() => handleMixStatus()}
                        style={
                            reduxState.media[0].mixState[
                                reduxState.appNav[0].activeTab
                            ]
                                ? { backgroundColor: 'rgb(28, 115, 165)' }
                                : { backgroundColor: 'grey' }
                        }
                    >
                        MIX
                    </button>
                </div>
                <div className="App-button-background">
                    <button
                        className="App-switch-button"
                        onClick={() => handleManualStartStatus()}
                        style={
                            reduxState.media[0].manualstartState[
                                reduxState.appNav[0].activeTab
                            ]
                                ? { backgroundColor: 'rgb(28, 115, 165)' }
                                : { backgroundColor: 'grey' }
                        }
                    >
                        MANUAL
                    </button>

                    <button
                        hidden={
                            !reduxState.media[0].manualstartState[
                                reduxState.appNav[0].activeTab
                            ]
                        }
                        className="App-start-button"
                        onClick={() =>
                            socket.emit(
                                IO.PGM_PLAY,
                                reduxState.appNav[0].activeTab
                            )
                        }
                    >
                        START
                    </button>
                </div>
            </header>
        )
    }

    const RenderTextViewHeader = () => {
        let { appNav } = reduxState

        return (
            <header className="App-text-view-header">
                <div className="App-text-view-title-background">
                    <img
                        src={''}
                        className="App-text-view-header-pgm-thumbnail-image"
                    />
                    <button className="App-text-view-header-pgm-counter"></button>
                </div>

                <div className="App-text-view-reload-setup-background">
                    <label
                        className="App-text-view-connection-status"
                        style={
                            appNav[0].connectionStatus
                                ? { backgroundColor: 'rgb(0, 128, 4)' }
                                : { backgroundColor: 'red' }
                        }
                    >
                        {appNav[0].connectionStatus ? 'VIEW' : 'CONNECTING'}
                    </label>
                </div>

                <div className="App-text-view-mix-button-background">
                    <button
                        className="App-text-view-start-button"
                        onClick={() =>
                            socket.emit(IO.PGM_PLAY, appNav[0].activeTab)
                        }
                    >
                        START
                    </button>
                </div>
            </header>
        )
    }

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
            {reduxState.appNav[0].showSettingsActive ? <SettingsPage /> : null}
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
