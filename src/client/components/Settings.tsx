import React from 'react'
import '../css/Settings.css'
import { reduxState, reduxStore } from '../../model/reducers/store'
import { setGenerics } from '../../model/reducers/settingsAction'
import { socket } from '../util/SocketClientHandlers'
import * as IO from '../../model/SocketIoConstants'
import { TOGGLE_SHOW_SETTINGS } from '../../model/reducers/appNavAction'

// Check if URL has specifiet a channel:
const channel = new URLSearchParams(window.location.search).get('channel')
const specificChannel = parseInt(channel) || 0

//Set style for Select dropdown component:
const selectorColorStyles = {
    control: (styles) => ({
        ...styles,
        backgroundColor: '#676767',
        color: 'white',
        border: 0,
    }),
    option: (styles) => {
        return {
            backgroundColor: '#AAAAAA',
            color: 'white',
        }
    },
    singleValue: (styles) => ({ ...styles, color: 'white' }),
}

export const SettingsPage = () => {
    const handleSettingsPage = () => {
        reduxStore.dispatch({
            type: TOGGLE_SHOW_SETTINGS,
        })
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
            <RenderOutputSettings />
            <hr />
            <div className="Settings-channel-form">
                <button
                    className="save-button"
                    onClick={() => {
                        handleSave()
                    }}
                >
                    UPDATE CLIPTOOL SETTINGS
                </button>
                {!specificChannel ? (
                    <button
                        className="save-button"
                        onClick={() => handleRestart()}
                    >
                        RESTART CLIPTOOL
                    </button>
                ) : (
                    <React.Fragment />
                )}
                <button
                    className="save-button"
                    onClick={() => handleSettingsPage()}
                >
                    EXIT
                </button>
            </div>
        </div>
    )
}

const RenderOutputSettings = () => {
    const handleOutputLabel = (event) => {
        let generics = { ...reduxState.settings[0].generics }
        generics.outputLabels[parseInt(event.target.name)] = event.target.value
        reduxStore.dispatch(setGenerics(generics))
    }
    const handleLoop = (event) => {
        let generics = { ...reduxState.settings[0].generics }
        generics.startupLoopState[parseInt(event.target.name)] =
            event.target.checked
        reduxStore.dispatch(setGenerics(generics))
    }
    const handleMix = (event) => {
        let generics = { ...reduxState.settings[0].generics }
        generics.startupMixState[parseInt(event.target.name)] =
            event.target.checked
        reduxStore.dispatch(setGenerics(generics))
    }
    const handleManual = (event) => {
        let generics = { ...reduxState.settings[0].generics }
        generics.startupManualstartState[parseInt(event.target.name)] =
            event.target.checked
        reduxStore.dispatch(setGenerics(generics))
    }

    const handleScale = (event) => {
        let generics = { ...reduxState.settings[0].generics }
        generics.scale[parseInt(event.target.name)] = event.target.checked
        reduxStore.dispatch(setGenerics(generics))
    }

    const handleScaleX = (event) => {
        let generics = { ...reduxState.settings[0].generics }
        generics.scaleX[parseInt(event.target.name)] = event.target.value
        reduxStore.dispatch(setGenerics(generics))
    }
    const handleScaleY = (event) => {
        let generics = { ...reduxState.settings[0].generics }
        generics.scaleY[parseInt(event.target.name)] = event.target.value
        reduxStore.dispatch(setGenerics(generics))
    }

    const handleStartupWebState = (event) => {
        let generics = { ...reduxState.settings[0].generics }
        generics.startupWebState[parseInt(event.target.name)] =
            event.target.checked
        reduxStore.dispatch(setGenerics(generics))
    }
    const handleWebURL = (event) => {
        let generics = { ...reduxState.settings[0].generics }
        generics.webURL[parseInt(event.target.name)] = event.target.value
        reduxStore.dispatch(setGenerics(generics))
    }

    const handleTabMediaFolder = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        let generics = { ...reduxState.settings[0].generics }
        generics.outputFolders[parseInt(event.target.name)] = event.target.value
        reduxStore.dispatch(setGenerics(generics))
    }

    const renderSingleOutput = (index: number) => {
        return (
            <form className="Settings-channel-form" key={index}>
                <label className="settings-channel-header">
                    OUTPUT {index + 1} :
                </label>
                <label className="Settings-input-field">
                    LABEL :
                    <br />
                    <input
                        name={String(index)}
                        type="text"
                        value={
                            reduxState.settings[0].generics.outputLabels[index]
                        }
                        onChange={handleOutputLabel}
                    />
                </label>
                <label className="Settings-input-field">
                    MEDIAFOLDER :
                    <br />
                    <select
                        className="settings-select"
                        name={String(index)}
                        onChange={(event) => handleTabMediaFolder(event)}
                        value={
                            reduxState.settings[0].generics.outputFolders[index]
                        }
                    >
                        {reduxState.media[0].folderList.map(
                            (path: string, folderIndex: number) => {
                                return (
                                    <option key={folderIndex} value={path}>
                                        {path}
                                    </option>
                                )
                            }
                        )}
                    </select>
                </label>
                <label className="Settings-input-field">
                    FORMAT :
                    <br />
                    {reduxState.settings[0].ccgConfig.channels[index].videoMode}
                </label>
                <label className="Settings-tick-field">
                    LOOP :
                    <br />
                    <input
                        name={String(index)}
                        type="checkbox"
                        checked={
                            reduxState.settings[0].generics.startupLoopState?.[
                                index
                            ]
                        }
                        onChange={handleLoop}
                    />
                </label>
                <label className="Settings-tick-field">
                    MIX :
                    <br />
                    <input
                        name={String(index)}
                        type="checkbox"
                        checked={
                            reduxState.settings[0].generics.startupMixState?.[
                                index
                            ]
                        }
                        onChange={handleMix}
                    />
                </label>
                <label className="Settings-tick-field">
                    MANUAL :
                    <br />
                    <input
                        name={String(index)}
                        type="checkbox"
                        checked={
                            reduxState.settings[0].generics
                                .startupManualstartState?.[index]
                        }
                        onChange={handleManual}
                    />
                </label>
                <label className="Settings-tick-field">
                    OVERLAY :
                    <br />
                    <input
                        name={String(index)}
                        type="checkbox"
                        checked={
                            reduxState.settings[0].generics.startupWebState?.[
                                index
                            ]
                        }
                        onChange={handleStartupWebState}
                    />
                </label>
                <label className="Settings-input-field">
                    OVERLAY URL :
                    <br />
                    <input
                        name={String(index)}
                        type="text"
                        value={reduxState.settings[0].generics.webURL[index]}
                        onChange={handleWebURL}
                    />
                </label>
                <label className="Settings-tick-field">
                    SCALE :
                    <br />
                    <input
                        name={String(index)}
                        type="checkbox"
                        checked={reduxState.settings[0].generics.scale[index]}
                        onChange={handleScale}
                    />
                </label>
                {reduxState.settings[0].generics.scale[index] ? (
                    <React.Fragment>
                        <label className="Settings-input-field">
                            SCALE X :
                            <br />
                            <input
                                name={String(index)}
                                type="number"
                                value={
                                    reduxState.settings[0].generics.scaleX[
                                        index
                                    ]
                                }
                                onChange={handleScaleX}
                            />
                            px
                        </label>
                        <label className="Settings-input-field">
                            SCALE Y :
                            <br />
                            <input
                                name={String(index)}
                                type="number"
                                value={
                                    reduxState.settings[0].generics.scaleY[
                                        index
                                    ]
                                }
                                onChange={handleScaleY}
                            />
                            px
                        </label>
                    </React.Fragment>
                ) : (
                    <React.Fragment></React.Fragment>
                )}
            </form>
        )
    }

    return (
        <div>
            {specificChannel
                ? renderSingleOutput(specificChannel - 1)
                : reduxState.settings[0].ccgConfig.channels.map(
                      (item, index) => {
                          return renderSingleOutput(index)
                      }
                  )}
        </div>
    )
}
