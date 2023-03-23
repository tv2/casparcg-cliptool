import React, { useState } from "react"
import { CcgConfigChannel, OutputSettings } from "../../../model/reducers/settingsModels"
import { reduxState } from "../../../model/reducers/store"
import '../../css/Settings.css'
import eventService from "../../services/eventService"
import SettingsInput, { SettingsInputType } from "./settingsInput"

interface SingleOutputProps {
  configChannel?: CcgConfigChannel
  index: number
  outputSettings: OutputSettings
  setOutputSettings: (output: OutputSettings, index: number) => void
}

export default function SingleOutput(props: SingleOutputProps): JSX.Element {
    const [label, setLabel] = useState(props.outputSettings.label)
    const [folder, setFolder] = useState(props.outputSettings.folder)
    const [loopState, setLoopState] = useState(props.outputSettings.loopState)
    const [mixState, setMixState] = useState(props.outputSettings.mixState)
    const [manualStartState, setManualStartState] = useState(props.outputSettings.manualStartState)
    const [webState, setWebState] = useState(props.outputSettings.webState)
    const [webUrl, setWebUrl] = useState(props.outputSettings.webUrl)
    const [shouldScale, setShouldScale] = useState(props.outputSettings.shouldScale)
    const [scaleX, setScaleX] = useState(props.outputSettings.scaleX)
    const [scaleY, setScaleY] = useState(props.outputSettings.scaleY)
    return (    
        props.outputSettings &&         
            <form className="Settings-channel-form">
                <label className="settings-channel-header">
                    OUTPUT {props.index + 1} :
                </label>
                <SettingsInput 
                    preDescription="LABEL :"
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
                    type={SettingsInputType.CHECKBOX}
                    value={loopState}
                    onChange={saveTempLoopChange}
                />
                <SettingsInput 
                    preDescription="MIX :"
                    type={SettingsInputType.CHECKBOX}
                    value={mixState}
                    onChange={saveTempMixChange}
                />
                <SettingsInput 
                    preDescription="MANUAL :"
                    type={SettingsInputType.CHECKBOX}
                    value={manualStartState}
                    onChange={saveTempManualChange}
                />
                <SettingsInput 
                    preDescription="OVERLAY :"
                    type={SettingsInputType.CHECKBOX}
                    value={webState}
                    onChange={saveTempWebStateChange}
                />
                <SettingsInput 
                    preDescription="OVERLAY URL :"
                    type={SettingsInputType.TEXT}
                    value={webUrl}
                    onChange={saveTempWebUrlChange}
                />
                <SettingsInput 
                    preDescription="SCALE :"
                    type={SettingsInputType.CHECKBOX}
                    value={shouldScale}
                    onChange={saveTempShouldScaleChange}
                />
                {shouldScale && (
                    <React.Fragment>
                        <SettingsInput 
                            preDescription="SCALE X :"
                            type={SettingsInputType.NUMBER}
                            value={scaleX}
                            onChange={saveTempScaleXChange}
                            postDescription='px'
                        />
                        <SettingsInput 
                            preDescription="SCALE Y :"
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
        props.outputSettings.label = newLabel
        props.setOutputSettings(props.outputSettings, props.index)
    }
    
    function saveTempLoopChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newLoop = eventService.getCheckedFromEvent(event)
        setLoopState(newLoop)
        props.outputSettings.loopState = newLoop
        props.setOutputSettings(props.outputSettings, props.index)
    }
    
    function saveTempMixChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newMix = eventService.getCheckedFromEvent(event)
        setMixState(newMix)
        props.outputSettings.mixState = newMix
        props.setOutputSettings(props.outputSettings, props.index)
    }

    function saveTempManualChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newManual = eventService.getCheckedFromEvent(event)
        setManualStartState(newManual)
        props.outputSettings.manualStartState = newManual
        props.setOutputSettings(props.outputSettings, props.index)
    }
    
    function saveTempShouldScaleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newShouldScale = eventService.getCheckedFromEvent(event)
        setShouldScale(newShouldScale)
        props.outputSettings.shouldScale = newShouldScale
        props.setOutputSettings(props.outputSettings, props.index)
    }
    
    function saveTempScaleXChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newScaleX = eventService.getNumberFromEvent(event)
        setScaleX(newScaleX)
        props.outputSettings.scaleX = newScaleX
        props.setOutputSettings(props.outputSettings, props.index)
    }
    
    function saveTempScaleYChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newScaleY = eventService.getNumberFromEvent(event)
        setScaleY(newScaleY)
        props.outputSettings.scaleY = newScaleY
        props.setOutputSettings(props.outputSettings, props.index)
    }
    
    function saveTempWebStateChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newWebState = eventService.getCheckedFromEvent(event)
        setWebState(newWebState)
        props.outputSettings.webState = newWebState
        props.setOutputSettings(props.outputSettings, props.index)
    }

    function saveTempWebUrlChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newWebUrl = eventService.getTextFromEvent(event)
        setWebUrl(newWebUrl)
        props.outputSettings.webUrl = newWebUrl
        props.setOutputSettings(props.outputSettings, props.index)
    }
    
    function saveTempTabMediaFolderChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        const newFolder = event.target.value
        setFolder(newFolder)
        props.outputSettings.folder = newFolder
        props.setOutputSettings(props.outputSettings, props.index)
    }    
}



