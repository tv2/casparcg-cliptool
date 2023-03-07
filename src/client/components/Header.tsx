import React from 'react'
import { reduxStore, reduxState } from '../../model/reducers/store'
import { useSelector } from 'react-redux'
import { socket } from '../util/SocketClientHandlers'
import { TOGGLE_SHOW_SETTINGS } from '../../model/reducers/appNavAction'

import * as IO from '../../model/SocketIoConstants'

//CSS files:
import '../css/App.css'
import '../css/App-header.css'
import '../css/App-control-view-header.css'
import '../css/App-text-view-header.css'
import { IOutput } from '../../model/reducers/mediaReducer'
import MediaService from "../services/mediaService";


const OFF_COLOR = { backgroundColor: 'grey' }
const ON_COLOR = { backgroundColor: 'rgb(28, 115, 165)' }

const RenderTime = () => {  
    const activeTab: number = useSelector(
        (storeUpdate: any) => storeUpdate.appNav[0].activeTab)
    const output: IOutput = useSelector(
        (storeUpdate: any) => storeUpdate.media[0].output[activeTab])
    const tallyFile: string = useSelector(
        (storeUpdate: any) => storeUpdate.media[0].output[activeTab]?.tallyFile)
    useSelector(
        (storeUpdate: any) => storeUpdate.media[0].output[activeTab]?.time[0])

    return (
        <div className="App-timer-background">
            <button className="App-header-pgm-counter">
                {MediaService.secondsToTimeCode(
                    output?.time,
                    reduxState.settings[0].ccgConfig.channels[activeTab]?.videoFormat?.frameRate
                )}
            </button>
            <img
                src={MediaService.findThumbnail(tallyFile, activeTab)}
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

const loopStateStyle = (loopState: boolean) => {
    return loopState
        ? ON_COLOR
        : OFF_COLOR
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

const mixStateStyle = (mixState: boolean) => {
    return mixState
        ? ON_COLOR
        : OFF_COLOR
}

const webStateStyle = (webState: boolean) => {
    return webState
        ? ON_COLOR
        : OFF_COLOR
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
    const activeTab: number = useSelector(
        (storeUpdate: any) => storeUpdate.appNav[0].activeTab)
    const mixState: boolean = useSelector(
        (storeUpdate: any) => storeUpdate.media[0].output[activeTab]?.mixState)
    const webState: boolean = useSelector(
        (storeUpdate: any) => storeUpdate.media[0].output[activeTab]?.webState)
    const loopState: boolean = useSelector(
        (storeUpdate: any) => storeUpdate.media[0].output[activeTab]?.loopState)
    const manualstartState: boolean = useSelector(
        (storeUpdate: any) => storeUpdate.media[0].output[activeTab]?.manualstartState)

    return (
        <header className="App-header">
            <div className="App-header__controls">
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
                                onClick={handleLoopStatus}
                                style={loopStateStyle(loopState)}
                            >
                                LOOP
                            </button>
                        </div>
                        <div className="App-button-background">
                            <button
                                className="App-switch-button"
                                onClick={handleMixStatus}
                                style={mixStateStyle(mixState)}
                            >
                                MIX
                            </button>
                        </div>
                        <div className="App-button-background">
                            <button
                                className="App-switch-button"
                                onClick={handleWebState}
                                style={webStateStyle(webState)}
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
                        onClick={handleManualStartStatus}
                        style={
                            manualstartState
                                ? ON_COLOR
                                : OFF_COLOR
                        }
                    >
                        MANUAL
                    </button>

                    <button
                        hidden={ !manualstartState }
                        className="App-start-button"
                        onClick={() => socket.emit(IO.PGM_PLAY, activeTab) }
                    >
                        START
                    </button>
                </div>
            </div>            
            {!reduxState.appNav[0].connectionStatus ? (
                <div className="App-header-server-offline">CONNECTING TO SERVER...</div>
            ) : null}
        </header>
    )
}
