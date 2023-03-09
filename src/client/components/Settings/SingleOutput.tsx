import React from "react"
import { reduxState, reduxStore } from "../../../model/reducers/store"
import { setGenerics } from '../../../model/reducers/settingsAction'
import { ICcgConfigChannel } from "../../../model/reducers/settingsReducer"

interface SingleOutputProps {
  configChannel?: ICcgConfigChannel
  index: number
}

export default function SingleOutput(props: SingleOutputProps): JSX.Element {
  return (
    <form className="Settings-channel-form">
        <label className="settings-channel-header">
            OUTPUT {props.index + 1} :
        </label>
        <label className="Settings-input-field">
            LABEL :
            <br />
            <input
                name={String(props.index)}
                type="text"
                value={
                    reduxState.settings[0].generics.outputLabels[props.index]
                }
                onChange={handleOutputLabel}
            />
        </label>
        <label className="Settings-input-field">
            MEDIA FOLDER :
            <br />
            <select
                className="settings-select"
                name={String(props.index)}
                onChange={(event) => handleTabMediaFolder(event)}
                value={
                    reduxState.settings[0].generics.outputFolders[props.index]
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
            {reduxState.settings[0].ccgConfig.channels[props.index].videoMode}
        </label>
        <label className="Settings-tick-field">
            LOOP :
            <br />
            <input
                name={String(props.index)}
                type="checkbox"
                checked={
                    reduxState.settings[0].generics.startupLoopState?.[
                        props.index
                    ]
                }
                onChange={handleLoop}
            />
        </label>
        <label className="Settings-tick-field">
            MIX :
            <br />
            <input
                name={String(props.index)}
                type="checkbox"
                checked={
                    reduxState.settings[0].generics.startupMixState?.[
                        props.index
                    ]
                }
                onChange={handleMix}
            />
        </label>
        <label className="Settings-tick-field">
            MANUAL :
            <br />
            <input
                name={String(props.index)}
                type="checkbox"
                checked={
                    reduxState.settings[0].generics
                        .startupManualStartState?.[props.index]
                }
                onChange={handleManual}
            />
        </label>
        <label className="Settings-tick-field">
            OVERLAY :
            <br />
            <input
                name={String(props.index)}
                type="checkbox"
                checked={
                    reduxState.settings[0].generics.startupWebState?.[
                        props.index
                    ]
                }
                onChange={handleStartupWebState}
            />
        </label>
        <label className="Settings-input-field">
            OVERLAY URL :
            <br />
            <input
                name={String(props.index)}
                type="text"
                value={reduxState.settings[0].generics.webURL?.[props.index]}
                onChange={handleWebURL}
            />
        </label>
        <label className="Settings-tick-field">
            SCALE :
            <br />
            <input
                name={String(props.index)}
                type="checkbox"
                checked={reduxState.settings[0].generics.scale[props.index]}
                onChange={handleScale}
            />
        </label>
        {reduxState.settings[0].generics.scale[props.index] ? (
            <React.Fragment>
                <label className="Settings-input-field">
                    SCALE X :
                    <br />
                    <input
                        name={String(props.index)}
                        type="number"
                        value={
                            reduxState.settings[0].generics.scaleX[
                                props.index
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
                        name={String(props.index)}
                        type="number"
                        value={
                            reduxState.settings[0].generics.scaleY[
                                props.index
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

function handleOutputLabel(event: React.ChangeEvent<HTMLInputElement>) {
  let generics = { ...reduxState.settings[0].generics }
  generics.outputLabels[parseInt(event.target.name)] = event.target.value
  reduxStore.dispatch(setGenerics(generics))
}

function handleLoop(event: React.ChangeEvent<HTMLInputElement>) {
  let generics = { ...reduxState.settings[0].generics }
  generics.startupLoopState[parseInt(event.target.name)] =
      event.target.checked
  reduxStore.dispatch(setGenerics(generics))
}

function handleMix(event: React.ChangeEvent<HTMLInputElement>) {
  let generics = { ...reduxState.settings[0].generics }
  generics.startupMixState[parseInt(event.target.name)] =
      event.target.checked
  reduxStore.dispatch(setGenerics(generics))
}
function handleManual(event: React.ChangeEvent<HTMLInputElement>) {
  let generics = { ...reduxState.settings[0].generics }
  generics.startupManualStartState[parseInt(event.target.name)] =
      event.target.checked
  reduxStore.dispatch(setGenerics(generics))
}

function handleScale(event: React.ChangeEvent<HTMLInputElement>) {
  let generics = { ...reduxState.settings[0].generics }
  generics.scale[parseInt(event.target.name)] = event.target.checked
  reduxStore.dispatch(setGenerics(generics))
}

function handleScaleX(event: React.ChangeEvent<HTMLInputElement>) {
  let generics = { ...reduxState.settings[0].generics }
  generics.scaleX[parseInt(event.target.name)] = Number(event.target.value)
  reduxStore.dispatch(setGenerics(generics))
}

function handleScaleY(event: React.ChangeEvent<HTMLInputElement>) {
  let generics = { ...reduxState.settings[0].generics }
  generics.scaleY[parseInt(event.target.name)] = Number(event.target.value)
  reduxStore.dispatch(setGenerics(generics))
}

function handleStartupWebState(event: React.ChangeEvent<HTMLInputElement>) {
  let generics = { ...reduxState.settings[0].generics }
  generics.startupWebState[parseInt(event.target.name)] =
      event.target.checked
  reduxStore.dispatch(setGenerics(generics))
}
function handleWebURL(event: React.ChangeEvent<HTMLInputElement>) {
  let generics = { ...reduxState.settings[0].generics }
  generics.webURL[parseInt(event.target.name)] = event.target.value
  reduxStore.dispatch(setGenerics(generics))
}

function handleTabMediaFolder(
  event: React.ChangeEvent<HTMLSelectElement>
) {
  let generics = { ...reduxState.settings[0].generics }
  generics.outputFolders[parseInt(event.target.name)] = event.target.value
  reduxStore.dispatch(setGenerics(generics))
}