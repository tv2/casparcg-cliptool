import React from 'react'
import '../css/Settings.css'
import { reduxState, reduxStore } from '../../model/reducers/store'
import { setGenerics } from '../../model/reducers/settingsAction'
import { socket } from '../util/SocketClientHandlers'
import * as IO from '../../model/SocketIoConstants'
import { TOGGLE_SHOW_SETTINGS } from '../../model/reducers/appNavAction'
import { OperationMode } from '../../model/reducers/mediaReducer'
import { useSelector } from 'react-redux'
import Outputs from './Settings/Outputs'

// Check if URL has specifiet a channel:
const channel = new URLSearchParams(window.location.search).get('channel')
const specificChannel = parseInt(channel) || 0

const OFF_COLOR = { backgroundColor: 'rgb(41, 41, 41)' }
const ON_COLOR = { backgroundColor: 'rgb(28, 115, 165)' }

function handleEditVisibilityMode(): void {
    const activeTab: number = reduxState.appNav[0].activeTab
    const output = reduxState.media[0].output[activeTab]
    if (output.operationMode !== OperationMode.EDIT_VISIBILITY) {
        toggleSettingsPage()
    }
    socket.emit(
        IO.SET_OPERATION_MODE, 
        activeTab, 
        output
            .operationMode !== OperationMode.EDIT_VISIBILITY 
            ? OperationMode.EDIT_VISIBILITY 
            : OperationMode.CONTROL
    )
}

function toggleSettingsPage(): void {
    reduxStore.dispatch({
        type: TOGGLE_SHOW_SETTINGS,
    })
}

function getEditVisibilityStyle(operationMode: OperationMode): { backgroundColor: string } {
    return operationMode === OperationMode.EDIT_VISIBILITY
        ? ON_COLOR
        : OFF_COLOR
}

export const SettingsPage = () => {        
    const operationMode = useSelector(
        (storeUpdate: any) => 
            storeUpdate.media[0].output[reduxState.appNav[0].activeTab]?.operationMode)
    useSelector((storeUpdate: any) => storeUpdate.settings[0].generics)
    
    const handleSettingsPage = () => {
        toggleSettingsPage()
    }

    const handleChange = (event) => {
        let generics = { ...reduxState.settings[0].generics }
        generics[event.target.name] = event.target.value
        reduxStore.dispatch(setGenerics(generics))
    }

    const handleSave = () => {
        socket.emit(IO.SET_GENERICS, reduxState.settings[0].generics)
    }

    const handleRestart = () => {
        if (
            window.confirm(
                'Restarting server will stop all outputs, are you sure?'
            )
        ) {
            console.log('Restarting server...')
            socket.emit(IO.RESTART_SERVER)
        }
    }

    return (
        <div className="Settings-body">
            <p className="Settings-header">SETTINGS :</p>
            <div className="Settings-channel-form">
                <button
                    className="save-button"
                    onClick={handleSave}
                >
                    SAVE SETTINGS
                </button>
                <button
                    className="save-button"
                    onClick={handleSettingsPage}
                >
                    DISCARD CHANGES
                </button>
                <button
                    className="save-button"
                    onClick={handleEditVisibilityMode}
                    style={getEditVisibilityStyle(operationMode)}
                >
                    EDIT VISIBILITY
                </button>
                {!specificChannel ? (
                    <button
                        className="save-button"
                        onClick={handleRestart}
                    >
                        RESTART CLIPTOOL
                    </button>
                ) : (
                    <React.Fragment />
                )}
            </div>
            <hr/>
            {!specificChannel ? (
                <form className="Settings-form">
                    <div className="Settings-channel-form">
                        <label className="Settings-input-field">
                            IP ADDRESS :
                            <br />
                            <input
                                name="ccgIp"
                                type="text"
                                value={reduxState.settings[0].generics.ccgIp}
                                onChange={handleChange}
                            />
                        </label>
                        <label className="Settings-input-field">
                            AMCP PORT :
                            <br />
                            <input
                                name="ccgAmcpPort"
                                type="number"
                                value={
                                    reduxState.settings[0].generics.ccgAmcpPort
                                }
                                onChange={handleChange}
                            />
                        </label>
                        <label className="Settings-input-field">
                            OSC PORT (into ClipTool) :
                            <br />
                            <input
                                name="ccgOscPort"
                                type="number"
                                value={
                                    reduxState.settings[0].generics.ccgOscPort
                                }
                                onChange={handleChange}
                            />
                        </label>
                        <label className="Settings-input-field">
                            DEFAULT LAYER :
                            <br />
                            <input
                                name="ccgDefaultLayer"
                                type="number"
                                value={
                                    reduxState.settings[0].generics
                                        .ccgDefaultLayer
                                }
                                onChange={handleChange}
                            />
                        </label>
                        <label className="Settings-input-field">
                            TRANSITION TIME :
                            <br />
                            <input
                                name="transistionTime"
                                type="number"
                                value={
                                    reduxState.settings[0].generics
                                        .transistionTime
                                }
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <hr />
                </form>
            ) : (
                <React.Fragment />
            )}
            <Outputs />
        </div>
    )
}
