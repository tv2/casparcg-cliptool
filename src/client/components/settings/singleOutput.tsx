import React, { useState } from "react"
import { CcgConfigChannel, OutputSettings } from "../../../model/reducers/settingsModels"
import { reduxState } from "../../../model/reducers/store"
import '../../css/Settings.css'
import eventService from "../../services/eventService"
import SettingsInput, { SettingsInputType } from "./settingsInput"

interface SingleOutputProps {
  configChannel?: CcgConfigChannel
  index: number
  output: OutputSettings
  setOutput: (output: OutputSettings, index: number) => void
}

export default function SingleOutput(props: SingleOutputProps): JSX.Element {
    const [label, setLabel] = useState(props.output.label)
    const [folder, setFolder] = useState(props.output.folder)
    const [loopState, setLoopState] = useState(props.output.loopState)
    const [mixState, setMixState] = useState(props.output.mixState)
    const [manualStartState, setManualStartState] = useState(props.output.manualStartState)
    const [webState, setWebState] = useState(props.output.webState)
    const [webUrl, setWebUrl] = useState(props.output.webUrl)
    const [shouldScale, setShouldScale] = useState(props.output.shouldScale)
    const [scaleX, setScaleX] = useState(props.output.scaleX)
    const [scaleY, setScaleY] = useState(props.output.scaleY)
    return (    
        props.output &&         
            <form className="Settings-channel-form">
                <label className="settings-channel-header">
                    OUTPUT {props.index + 1} :
                </label>
                <SettingsInput 
                    preDescription="LABEL :"
                    name={props.index}
                    type={SettingsInputType.TEXT}
                    value={label}
                    onChange={saveTempOutputLabelChange}
                />
                <label className="Settings-input-field">
                    MEDIA FOLDER :
                    <br />
                    <select
                        className="settings-select"
                        name={String(props.index)}
                        onChange={saveTempTabMediaFolderChange}
                        value={ folder }
                    >
                        {reduxState.media.folderList.map(
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
                    {props.configChannel 
                    ? props.configChannel.videoMode 
                    : reduxState.settings.ccgConfig.channels[props.index].videoMode}
                </label>
                <SettingsInput 
                    preDescription="LOOP :"
                    name={props.index}
                    type={SettingsInputType.CHECKBOX}
                    value={loopState}
                    onChange={saveTempLoopChange}
                />
                <SettingsInput 
                    preDescription="MIX :"
                    name={props.index}
                    type={SettingsInputType.CHECKBOX}
                    value={mixState}
                    onChange={saveTempMixChange}
                />
                <SettingsInput 
                    preDescription="MANUAL :"
                    name={props.index}
                    type={SettingsInputType.CHECKBOX}
                    value={manualStartState}
                    onChange={saveTempManualChange}
                />
                <SettingsInput 
                    preDescription="OVERLAY :"
                    name={props.index}
                    type={SettingsInputType.CHECKBOX}
                    value={webState}
                    onChange={saveTempWebStateChange}
                />
                <SettingsInput 
                    preDescription="OVERLAY URL :"
                    name={props.index}
                    type={SettingsInputType.TEXT}
                    value={webUrl}
                    onChange={saveTempWebUrlChange}
                />
                <SettingsInput 
                    preDescription="SCALE :"
                    name={props.index}
                    type={SettingsInputType.CHECKBOX}
                    value={shouldScale}
                    onChange={saveTempShouldScaleChange}
                />
                {shouldScale && (
                    <React.Fragment>
                        <SettingsInput 
                            preDescription="SCALE X :"
                            name={props.index}
                            type={SettingsInputType.NUMBER}
                            value={scaleX}
                            onChange={saveTempScaleXChange}
                            postDescription='px'
                        />
                        <SettingsInput 
                            preDescription="SCALE Y :"
                            name={props.index}
                            type={SettingsInputType.NUMBER}
                            value={scaleY}
                            onChange={saveTempScaleYChange}
                            postDescription='px'
                        />
                    </React.Fragment>
                )}
            </form>
    )

    function saveTempOutputLabelChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newLabel = eventService.getTextFromEvent(event)
        setLabel(newLabel)
        props.output.label = newLabel
        props.setOutput(props.output, props.index)
    }
    
    function saveTempLoopChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newLoop = eventService.getCheckedFromEvent(event)
        setLoopState(newLoop)
        props.output.loopState = newLoop
        props.setOutput(props.output, props.index)
    }
    
    function saveTempMixChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newMix = eventService.getCheckedFromEvent(event)
        setMixState(newMix)
        props.output.mixState = newMix
        props.setOutput(props.output, props.index)
    }

    function saveTempManualChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newManual = eventService.getCheckedFromEvent(event)
        setManualStartState(newManual)
        props.output.manualStartState = newManual
        props.setOutput(props.output, props.index)
    }
    
    function saveTempShouldScaleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newShouldScale = eventService.getCheckedFromEvent(event)
        setShouldScale(newShouldScale)
        props.output.shouldScale = newShouldScale
        props.setOutput(props.output, props.index)
    }
    
    function saveTempScaleXChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newScaleX = eventService.getNumberFromEvent(event)
        setScaleX(newScaleX)
        props.output.scaleX = newScaleX
        props.setOutput(props.output, props.index)
    }
    
    function saveTempScaleYChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newScaleY = eventService.getNumberFromEvent(event)
        setScaleY(newScaleY)
        props.output.scaleY = newScaleY
        props.setOutput(props.output, props.index)
    }
    
    function saveTempWebStateChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newWebState = eventService.getCheckedFromEvent(event)
        setWebState(newWebState)
        props.output.webState = newWebState
        props.setOutput(props.output, props.index)
    }

    function saveTempWebUrlChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newWebUrl = eventService.getTextFromEvent(event)
        setWebUrl(newWebUrl)
        props.output.webUrl = newWebUrl
        props.setOutput(props.output, props.index)
    }
    
    function saveTempTabMediaFolderChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        const newFolder = event.target.value
        setFolder(newFolder)
        props.output.folder = newFolder
        props.setOutput(props.output, props.index)
    }    
}



