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
        output ?         
            <form className="Settings-channel-form">
                <label className="settings-channel-header">
                    OUTPUT {props.index + 1} :
                </label>
                <SettingsInput 
                    preDescription="LABEL :"
                    name={props.index}
                    type={SettingsInputType.TEXT}
                    value={output.label}
                    onChange={(event) => handleOutputLabel(event)}
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
                    onChange={(event) => handleLoop(event)}
                />
                <SettingsInput 
                    preDescription="MIX :"
                    name={props.index}
                    type={SettingsInputType.CHECKBOX}
                    value={output.mixState}
                    onChange={(event) => handleMix(event)}
                />
                <SettingsInput 
                    preDescription="MANUAL :"
                    name={props.index}
                    type={SettingsInputType.CHECKBOX}
                    value={output.manualStartState}
                    onChange={(event) => handleManual(event)}
                />
                <SettingsInput 
                    preDescription="OVERLAY :"
                    name={props.index}
                    type={SettingsInputType.CHECKBOX}
                    value={output.webState}
                    onChange={(event) => handleWebState(event)}
                />
                <SettingsInput 
                    preDescription="OVERLAY URL :"
                    name={props.index}
                    type={SettingsInputType.TEXT}
                    value={output.webUrl}
                    onChange={(event) => handleWebUrl(event)}
                />
                <SettingsInput 
                    preDescription="SCALE :"
                    name={props.index}
                    type={SettingsInputType.CHECKBOX}
                    value={output.shouldScale}
                    onChange={(event) => handleScale(event)}
                />
                {output.shouldScale ? (
                    <React.Fragment>
                        <SettingsInput 
                            preDescription="SCALE X :"
                            name={props.index}
                            type={SettingsInputType.NUMBER}
                            value={output.scaleX}
                            onChange={(event) => handleScaleX(event)}
                            postDescription='px'
                        />
                        <SettingsInput 
                            preDescription="SCALE Y :"
                            name={props.index}
                            type={SettingsInputType.NUMBER}
                            value={output.scaleY}
                            onChange={(event) => handleScaleY(event)}
                            postDescription='px'
                        />
                    </React.Fragment>
                ) : (
                    <React.Fragment></React.Fragment>
                )}
            </form>
        : <></>
    )

    function handleOutputLabel(event: React.ChangeEvent<HTMLInputElement>) {
        output.label = getTextFromEvent(event);
        setOutput(output)
    }
    
    function handleLoop(event: React.ChangeEvent<HTMLInputElement>) {
        output.loopState = getCheckedFromEvent(event)
        setOutput(output)
    }
    
    function handleMix(event: React.ChangeEvent<HTMLInputElement>) {
        output.mixState = getCheckedFromEvent(event)
        setOutput(output)
    }
    function handleManual(event: React.ChangeEvent<HTMLInputElement>) {
        output.manualStartState = getCheckedFromEvent(event)
        setOutput(output)
    }
    
    function handleScale(event: React.ChangeEvent<HTMLInputElement>) {
        output.shouldScale = getCheckedFromEvent(event)
        setOutput(output)
    }
    
    function handleScaleX(event: React.ChangeEvent<HTMLInputElement>) {
        output.scaleX = getNumberFromEvent(event)
        setOutput(output)
    }
    
    function handleScaleY(event: React.ChangeEvent<HTMLInputElement>) {
        output.scaleY = getNumberFromEvent(event)
        setOutput(output)
    }
    
    function handleWebState(event: React.ChangeEvent<HTMLInputElement>) {
        output.webState = getCheckedFromEvent(event)
        setOutput(output)
    }

    function handleWebUrl(event: React.ChangeEvent<HTMLInputElement>) {
        output.webUrl = getTextFromEvent(event)
        setOutput(output)
    }
    
    function handleTabMediaFolder(event: React.ChangeEvent<HTMLSelectElement>) {
        output.folder = event.target.value
        setOutput(output)
    }

    function getTextFromEvent(event: React.ChangeEvent<HTMLInputElement>): string {
        return event.target.value
    }

    function getNumberFromEvent(event: React.ChangeEvent<HTMLInputElement>): number {
        return Number(event.target.value)
    }

    function getCheckedFromEvent(event: React.ChangeEvent<HTMLInputElement>): boolean {
        return event.target.checked
    }
}

