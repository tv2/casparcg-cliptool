import React from 'react'
import { reduxStore, reduxState } from '../../model/reducers/store'
import { shallowEqual, useSelector } from 'react-redux'

//CSS files:
import '../css/Rmc-tabs.css'
import '../css/App.css'
import '../css/App-header.css'
import '../css/App-control-view-header.css'
import '../css/App-text-view-header.css'
import { socket } from '../util/SocketClientHandlers'
import { secondsToTimeCode } from '../util/TimeCodeToString'
import { TOGGLE_SHOW_SETTINGS } from '../../model/reducers/appNavAction'

import * as IO from '../../model/SocketIoConstants'
import { findThumbPix } from './Thumbnail'
import { SettingsPage } from './Settings'

const RenderTime = () => {
    return (
        <div className="App-timer-background">
            <button className="App-header-pgm-counter">
                {secondsToTimeCode(
                    reduxState.media[0].output[reduxState.appNav[0].activeTab]
                        ?.time,
                    reduxState.settings[0].ccgConfig.channels[reduxState.appNav[0].activeTab]?.videoFormat?.frameRate
                )}
            </button>
            <img
                src={findThumbPix(
                    reduxState.media[0].output[reduxState.appNav[0].activeTab]
                        ?.tallyFile,
                    reduxState.appNav[0].activeTab
                )}
                className="App-header-pgm-thumbnail-image"
            />
        </div>
    )
}

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
        !reduxState.media[0].output[reduxState.appNav[0].activeTab].loopState
    )
}

const loopStateStyle = () => {
    return reduxState.media[0].output[reduxState.appNav[0].activeTab]?.loopState
        ? { backgroundColor: 'rgb(28, 115, 165)' }
        : { backgroundColor: 'grey' }
}

const handleMixStatus = () => {
    socket.emit(
        IO.SET_MIX_STATE,
        reduxState.appNav[0].activeTab,
        !reduxState.media[0].output[reduxState.appNav[0].activeTab].mixState
    )
}

const handleWebState = () => {
    socket.emit(
        IO.SET_WEB_STATE,
        reduxState.appNav[0].activeTab,
        !reduxState.media[0].output[reduxState.appNav[0].activeTab].webState
    )
}

const mixStateStyle = () => {
    return reduxState.media[0].output[reduxState.appNav[0].activeTab]?.mixState
        ? { backgroundColor: 'rgb(28, 115, 165)' }
        : { backgroundColor: 'grey' }
}

const webStateStyle = () => {
    return reduxState.media[0].output[reduxState.appNav[0].activeTab]?.webState
        ? { backgroundColor: 'rgb(28, 115, 165)' }
        : { backgroundColor: 'grey' }
}

const handleManualStartStatus = () => {
    socket.emit(
        IO.SET_MANUAL_START_STATE,
        reduxState.appNav[0].activeTab,
        !reduxState.media[0].output[reduxState.appNav[0].activeTab]
            .manualstartState
    )
}
export const RenderFullHeader = () => {
    // Redux hook:
    useSelector((storeUpdate) => storeUpdate, shallowEqual)

    return (
        <header className="App-header">
            {reduxState.appNav[0].selectView === 0 ? (
                <div className="App-reload-setup-background">
                    <button
                        className="App-settings-button"
                        onClick={() => handleSettingsPage()}
                    >
                        SETTINGS
                    </button>
                </div>
            ) : (
                ''
            )}

            <RenderTime />
            {reduxState.appNav[0].selectView === 0 ? (
                <React.Fragment>
                    <div className="App-button-background">
                        <button
                            className="App-switch-button"
                            onClick={() => {
                                handleLoopStatus()
                            }}
                            style={loopStateStyle()}
                        >
                            LOOP
                        </button>
                    </div>
                    <div className="App-button-background">
                        <button
                            className="App-switch-button"
                            onClick={() => handleMixStatus()}
                            style={mixStateStyle()}
                        >
                            MIX
                        </button>
                    </div>
                    <div className="App-button-background">
                        <button
                            className="App-switch-button"
                            onClick={() => handleWebState()}
                            style={webStateStyle()}
                        >
                            OVERLAY
                        </button>
                    </div>
                </React.Fragment>
            ) : (
                ''
            )}

            <div className="App-button-background">
                <button
                    className="App-switch-button"
                    onClick={() => handleManualStartStatus()}
                    style={
                        reduxState.media[0].output[
                            reduxState.appNav[0].activeTab
                        ]?.manualstartState
                            ? { backgroundColor: 'rgb(28, 115, 165)' }
                            : { backgroundColor: 'grey' }
                    }
                >
                    MANUAL
                </button>

                <button
                    hidden={
                        !reduxState.media[0].output[
                            reduxState.appNav[0].activeTab
                        ]?.manualstartState
                    }
                    className="App-start-button"
                    onClick={() =>
                        socket.emit(IO.PGM_PLAY, reduxState.appNav[0].activeTab)
                    }
                >
                    START
                </button>
            </div>
            {reduxState.appNav[0].showSettingsActive ? <SettingsPage /> : null}
            {!reduxState.appNav[0].connectionStatus ? (
                <div className="App-header-server-offline">CONNECTING TO SERVER...</div>
            ) : null}
        </header>
    )
}
