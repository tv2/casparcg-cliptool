import React from 'react'
import '../css/Settings.css'
import Select from 'react-select'
import { reduxState, reduxStore } from '../../model/reducers/store'
import { setGenerics } from '../../model/reducers/settingsAction'
import { socket } from '../util/SocketClientHandlers'
import * as IO from '../../model/SocketIoConstants'

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
    const handleChange = (event) => {
        let generics = { ...reduxState.settings[0].generics }
        generics[event.target.name] = event.target.value
        reduxStore.dispatch(setGenerics(generics))
    }

    const handleTabTitle = (event) => {
        var settingsCopy = Object.assign({})
        settingsCopy.tabData[event.target.name].title = event.target.value
    }

    const handleTabMediaFolder = (index, event) => {}
    const handleSave = () => {
        socket.emit(IO.SET_GENERICS, reduxState.settings[0].generics)
    }

    const RenderOutputSettings = () => {
        console.log('Settings for Output initialized')
        return (
            <div>
                {reduxState.settings[0].ccgConfig.channels.map(
                    (item, index) => {
                        return (
                            <div className="Settings-channel-form">
                                <label className="Settings-input-field">
                                    OUTPUT {index + 1} NAME :
                                    <br />
                                    <input
                                        name={String(index)}
                                        type="text"
                                        value={
                                            reduxState.settings[0].generics
                                                .outputLabels[index]
                                        }
                                        onChange={(event) =>
                                            handleChange(event)
                                        }
                                    />
                                </label>
                                <label className="Settings-input-field">
                                    MEDIAFOLDER :
                                    <Select
                                        styles={selectorColorStyles}
                                        className="Settings-input-selector"
                                        value={{
                                            label: 'item.subFolder',
                                            value: 'item.subFolder',
                                        }}
                                        onChange={(event) =>
                                            handleTabMediaFolder(index, event)
                                        }
                                        options={[
                                            { value: 'VALUE', label: 'LABEL' },
                                        ]}
                                    />
                                </label>
                            </div>
                        )
                    }
                )}
            </div>
        )
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
                <div>
                    <RenderOutputSettings />
                </div>
            </form>
            <hr />
            <button onClick={()=>{handleSave()} }
            >SAVE SETTINGS</button>
            <button>RESTART SERVER</button>
        </div>
    )
}
