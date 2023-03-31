import React, { useState } from "react"
import { CcgConfigChannel, OutputSettings } from "../../../model/reducers/settings-models"
import '../../css/Settings.css'
import eventService from "../../services/event-service"
import Label from "../shared/label"
import LabelledCheckboxInput from "../shared/labelled-checkbox-input"
import LabelledNumberInput from "../shared/labelled-number-input"
import LabelledTextInput from "../shared/labelled-text-input"

interface OutputProps {
  configChannel: CcgConfigChannel
  index: number
  outputSettings: OutputSettings
  folders: string[]
  setOutputSettings: (output: OutputSettings, index: number) => void
}

export default function Output(props: OutputProps): JSX.Element {
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
                <LabelledTextInput
                    labelClassName="Settings-input-field"
                    description="LABEL :"
                    value={label}
                    onChange={saveTempOutputLabelChange}
                />
                <Label className="Settings-input-field" 
                    description="MEDIA FOLDER :">
                    <select
                        className="settings-select"
                        name={String(props.index)}
                        onChange={saveTempTabMediaFolderChange}
                        value={ folder }
                    >
                        {props.folders.map(
                            (path: string, folderIndex: number) => {
                                return (
                                    <option key={folderIndex} value={path}>
                                        {path}
                                    </option>
                                )
                            }
                        )}
                    </select>
                </Label>
                <Label className="Settings-input-field"
                    description="FORMAT :">
                    { props.configChannel.videoMode }
                </Label>
                <LabelledCheckboxInput
                    description="LOOP :"
                    labelClassName="Settings-tick-field"
                    value={loopState}
                    onChange={saveTempLoopChange}
                />
                <LabelledCheckboxInput
                    description="MIX :"
                    labelClassName="Settings-tick-field"
                    value={mixState}
                    onChange={saveTempMixChange}
                />
                <LabelledCheckboxInput
                    description="MANUAL :"
                    labelClassName="Settings-tick-field"
                    value={manualStartState}
                    onChange={saveTempManualChange}
                />
                <LabelledCheckboxInput
                    description="OVERLAY :"
                    labelClassName="Settings-tick-field"
                    value={webState}
                    onChange={saveTempWebStateChange}
                />
                <LabelledTextInput
                    labelClassName="Settings-input-field"
                    description="OVERLAY URL :"
                    value={webUrl}
                    onChange={saveTempWebUrlChange}
                />
                <LabelledCheckboxInput
                    description="SCALE :"
                    labelClassName="Settings-tick-field"
                    value={shouldScale}
                    onChange={saveTempShouldScaleChange}
                />
                {shouldScale && (
                    <>
                        <LabelledNumberInput 
                            labelClassName="Settings-input-field"
                            description="SCALE X :"
                            value={scaleX}
                            onChange={saveTempScaleXChange}
                            numberUnit='px'
                        />
                        <LabelledNumberInput 
                            labelClassName="Settings-input-field"
                            description="SCALE Y :"
                            value={scaleY}
                            onChange={saveTempScaleYChange}
                            numberUnit='px'
                        />
                    </>
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



