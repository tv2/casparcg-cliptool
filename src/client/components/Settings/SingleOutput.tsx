import React, { useState } from "react"
import { CcgConfigChannel, OutputSettings } from "../../../model/reducers/settingsModels"
import { reduxState } from "../../../model/reducers/store"
import '../../css/Settings.css'
import SettingsInput, { SettingsInputType } from "./SettingsInput"

interface SingleOutputProps {
  configChannel?: CcgConfigChannel
  index: number
  output: OutputSettings
}

export default function SingleOutput(props: SingleOutputProps): JSX.Element {
    const [output, setOutput] = useState(props.output)
    return (
        <form className="Settings-channel-form">
            <label className="settings-channel-header">
                OUTPUT {props.index + 1} :
            </label>
            <SettingsInput 
                preDescription="LABEL :"
                name={props.index}
                type={SettingsInputType.TEXT}
                value={output.label}
                onChange={handleOutputLabel}
            />
            <label className="Settings-input-field">
                MEDIA FOLDER :
                <br />
                <select
                    className="settings-select"
                    name={String(props.index)}
                    onChange={(event) => handleTabMediaFolder(event)}
                    value={ output.folder }
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
            <SettingsInput 
                preDescription="LOOP :"
                name={props.index}
                type={SettingsInputType.CHECKBOX}
                value={output.loopState}
                onChange={handleLoop}
            />
            <SettingsInput 
                preDescription="MIX :"
                name={props.index}
                type={SettingsInputType.CHECKBOX}
                value={output.mixState}
                onChange={handleMix}
            />
             <SettingsInput 
                preDescription="MANUAL :"
                name={props.index}
                type={SettingsInputType.CHECKBOX}
                value={output.manualStartState}
                onChange={handleManual}
            />
            <SettingsInput 
                preDescription="OVERLAY :"
                name={props.index}
                type={SettingsInputType.CHECKBOX}
                value={output.webState}
                onChange={handleStartupWebState}
            />
            <SettingsInput 
                preDescription="OVERLAY URL :"
                name={props.index}
                type={SettingsInputType.TEXT}
                value={output.webUrl}
                onChange={handleWebURL}
            />
            <SettingsInput 
                preDescription="SCALE :"
                name={props.index}
                type={SettingsInputType.CHECKBOX}
                value={output.shouldScale}
                onChange={handleScale}
            />
            {output.shouldScale ? (
                <React.Fragment>
                    <SettingsInput 
                        preDescription="SCALE X :"
                        name={props.index}
                        type={SettingsInputType.NUMBER}
                        value={output.scaleX}
                        onChange={handleScaleX}
                        postDescription='px'
                    />
                    <SettingsInput 
                        preDescription="SCALE Y :"
                        name={props.index}
                        type={SettingsInputType.NUMBER}
                        value={output.scaleY}
                        onChange={handleScaleY}
                        postDescription='px'
                    />
                </React.Fragment>
            ) : (
                <React.Fragment></React.Fragment>
            )}
        </form>
    )
}

function handleOutputLabel(event: React.ChangeEvent<HTMLInputElement>) {

}

function handleLoop(event: React.ChangeEvent<HTMLInputElement>) {

}

function handleMix(event: React.ChangeEvent<HTMLInputElement>) {

}
function handleManual(event: React.ChangeEvent<HTMLInputElement>) {

}

function handleScale(event: React.ChangeEvent<HTMLInputElement>) {

}

function handleScaleX(event: React.ChangeEvent<HTMLInputElement>) {

}

function handleScaleY(event: React.ChangeEvent<HTMLInputElement>) {

}

function handleStartupWebState(event: React.ChangeEvent<HTMLInputElement>) {

}
function handleWebURL(event: React.ChangeEvent<HTMLInputElement>) {

}

function handleTabMediaFolder(event: React.ChangeEvent<HTMLSelectElement>) {

}