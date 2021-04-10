import React from 'react'
import '../css/Settings.css'
import { reduxState, reduxStore } from '../../model/reducers/store'
import { setGenerics } from '../../model/reducers/settingsAction'
import { socket } from '../util/SocketClientHandlers'
import * as IO from '../../model/SocketIoConstants'
import { TOGGLE_SHOW_SETTINGS } from '../../model/reducers/appNavAction'

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

    return (
        <div className="Settings-body">
            <p className="Settings-header">SETTINGS :</p>
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
                            value={reduxState.settings[0].generics.ccgAmcpPort}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="Settings-input-field">
                        OSC PORT (into ClipTool) :
                        <br />
                        <input
                            name="ccgOscPort"
                            type="number"
                            value={reduxState.settings[0].generics.ccgOscPort}
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
                                reduxState.settings[0].generics.ccgDefaultLayer
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
                                reduxState.settings[0].generics.transistionTime
                            }
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <hr />
            </form>
            <RenderOutputSettings />
            <hr />
            <button
                onClick={() => {
                    handleSave()
                }}
            >
                UPDATE SERVER SETTINGS
            </button>
            <button onClick={() => socket.emit(IO.RESTART_SERVER)}>
                RESTART SERVER
            </button>
            <button onClick={() => handleSettingsPage()}>EXIT</button>
        </div>
    )
}

const RenderOutputSettings = () => {
    const handleOutputLabel = (event) => {
        let generics = { ...reduxState.settings[0].generics }
        generics.outputLabels[parseInt(event.target.name)] = event.target.value
        reduxStore.dispatch(setGenerics(generics))
    }

    const handleTabMediaFolder = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        let generics = { ...reduxState.settings[0].generics }
        generics.outputFolders[parseInt(event.target.name)] = event.target.value
        reduxStore.dispatch(setGenerics(generics))
    }

    return (
        <div>
            {reduxState.settings[0].ccgConfig.channels.map((item, index) => {
                return (
                    <form className="Settings-channel-form" key={index}>
                        <label className="Settings-input-field">
                            OUTPUT {index + 1} LABEL :
                            <br />
                            <input
                                name={String(index)}
                                type="text"
                                value={
                                    reduxState.settings[0].generics
                                        .outputLabels[index]
                                }
                                onChange={handleOutputLabel}
                            />
                        </label>
                        <label className="Settings-input-field">
                            MEDIAFOLDER :
                            <select
                                name={String(index)}
                                onChange={(event) =>
                                    handleTabMediaFolder(event)
                                }
                                value={reduxState.settings[0].generics.outputFolders[index]}
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
                    </form>
                )
            })}
        </div>
    )
}
