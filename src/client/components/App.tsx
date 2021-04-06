import React from 'react'
import { Tabs } from 'rmc-tabs'
import { reduxStore, reduxState } from '../../model/reducers/store'
import { useSelector } from 'react-redux'

import * as IO from '../../model/SocketIoConstants'

// Components:
import { Thumbnail } from './Thumbnail'
import SettingsPage from './Settings'

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
import { SET_ACTIVE_TAB } from '../../model/reducers/appNavAction'

const MIX_DURATION = 6

export const App = () => {
    // Redux hook:
    const store = useSelector((store) => store)

    //Handler functions:
    const handleSettingsPage = () => {
        reduxStore.dispatch({
            type: 'TOGGLE_SHOW_SETTINGS',
        })
    }

    const handleLoopStatus = () => {
        socket.emit(
            IO.SET_LOOP_STATE,
            reduxState.appNav[0].activeTab,
            !reduxState.media[0].loop[reduxState.appNav[0].activeTab]
        )
    }

    const setActiveTab = (tab) => {
        reduxStore.dispatch({
            type: SET_ACTIVE_TAB,
            data: tab,
        })
    }

    //Rendering functions:

    const RenderFullHeader = () => {
        return (
            <header className="App-header">
                <div className="App-title-background">
                    <img src={''} className="App-header-pvw-thumbnail-image" />
                    <label className="App-header-pgm-counter">
                        {secondsToTimeCode(
                            reduxState.media[0].time[0]?.[0]
                        )}
                    </label>
                    <img src={''} className="App-header-pgm-thumbnail-image" />
                </div>

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

                <div className="App-loop-autoPlay-background">
                    <button
                        className="App-loop-button"
                        onClick={() => {
                            console.log('handleLoopStatus')
                            handleLoopStatus()
                        }}
                        style={
                            reduxState.media[0].loop[reduxState.appNav[0].activeTab]
                                ? { backgroundColor: 'rgb(28, 115, 165)' }
                                : { backgroundColor: 'grey' }
                        }
                    >
                        LOOP
                    </button>
                </div>

                <div className="App-mix-button-background">
                    <button
                        className="App-prev-cue-button"
                        onClick={() =>
                            socket.emit(
                                IO.CUE_PREV,
                                reduxState.appNav[0].activeTab + 1
                            )
                        }
                    >
                        PREV
                    </button>
                    <button
                        className="App-next-cue-button"
                        onClick={() =>
                            socket.emit(
                                IO.CUE_NEXT,
                                reduxState.appNav[0].activeTab + 1
                            )
                        }
                    >
                        NEXT
                    </button>
                    <button
                        className="App-mix-button"
                        onClick={() =>
                            socket.emit(
                                IO.PWV_PLAY,
                                reduxState.appNav[0].activeTab + 1
                            )
                        }
                    >
                        MIX
                    </button>
                    <button
                        className="App-start-button"
                        onClick={() =>
                            socket.emit(
                                IO.PGM_PLAY,
                                reduxState.appNav[0].activeTab + 1
                            )
                        }
                    >
                        START
                    </button>
                </div>
            </header>
        )
    }

    const RenderControlHeader = () => {
        let { appNav } = reduxState

        return (
            <header className="App-control-view-header">
                <div className="App-control-view-title-background">
                    <img
                        src={''}
                        className="App-control-view-header-pvw-thumbnail-image"
                    />
                    <div className="App-control-view-header-title">{''}</div>
                    <img
                        src={''}
                        className="App-control-view-header-pgm-thumbnail-image"
                    />
                    <button className="App-control-view-header-pgm-counter"></button>
                </div>

                <div className="App-control-view-reload-setup-background">
                    <label
                        className="App-control-view-connection-status"
                        style={
                            appNav[0].connectionStatus
                                ? { backgroundColor: 'rgb(0, 128, 4)' }
                                : { backgroundColor: 'red' }
                        }
                    >
                        {appNav[0].connectionStatus ? 'VIEW' : 'CONNECTING'}
                    </label>
                </div>

                <div className="App-control-view-loop-autoPlay-background">
                    <button
                        className="App-control-view-loop-button"
                        onClick={handleLoopStatus}
                        style={
                            reduxState.media[0].loop[reduxState.appNav[0].activeTab]
                                ? { backgroundColor: 'rgb(28, 115, 165)' }
                                : { backgroundColor: 'grey' }
                        }
                    >
                        LOOP
                    </button>
                </div>

                <div className="App-control-view-mix-button-background">
                    <button
                        className="App-control-view-prev-cue-button"
                        onClick={() =>
                            socket.emit(IO.CUE_PREV, appNav[0].activeTab + 1)
                        }
                    >
                        PREV
                    </button>
                    <button
                        className="App-control-view-next-cue-button"
                        onClick={() =>
                            socket.emit(IO.CUE_NEXT, appNav[0].activeTab + 1)
                        }
                    >
                        NEXT
                    </button>
                    <button
                        className="App-control-view-mix-button"
                        onClick={() =>
                            socket.emit(IO.PWV_PLAY, appNav[0].activeTab + 1)
                        }
                    >
                        MIX
                    </button>
                    <button
                        className="App-control-view-start-button"
                        onClick={() =>
                            socket.emit(IO.PGM_PLAY, appNav[0].activeTab + 1)
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
                            socket.emit(IO.PGM_PLAY, appNav[0].activeTab + 1)
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
            {reduxState.appNav[0].selectView === 2 ? (
                <RenderControlHeader />
            ) : (
                ''
            )}
            {reduxState.appNav[0].showSettingsActive ? <SettingsPage /> : null}
            <div className="App-body">
                <Tabs
                    tabs={reduxState.settings[0].tabData}
                    onChange={(tab, index) => setActiveTab(index)}
                >
                    {renderTabData()}
                </Tabs>
            </div>
        </div>
    )
}
