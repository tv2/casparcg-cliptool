import React from "react";
import { useSelector } from "react-redux";
import { setGenerics } from "../../../model/reducers/settingsAction";
import { reduxState, ReduxStateType, reduxStore } from "../../../model/reducers/store";
import '../../css/Settings.css'


export default function GeneralSettings(): JSX.Element {
  useSelector((storeUpdate: ReduxStateType) => storeUpdate.settings[0].generics)  

  return (
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
                            .transitionTime
                    }
                    onChange={handleChange}
                />
            </label>
        </div>
        <hr />
    </form>
  )
}

const handleChange = (event) => {
    let generics = { ...reduxState.settings[0].generics }
    generics[event.target.name] = event.target.value
    reduxStore.dispatch(setGenerics(generics))
}