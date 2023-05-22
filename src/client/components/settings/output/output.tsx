import React, { useState } from "react"
import { CcgConfigChannel, OutputSettings } from "../../../../model/reducers/settings-models"
import eventService from "../../../services/event-service"
import Label from "../../shared/label"
import LabelledCheckboxInput from "../../shared/labelled-checkbox-input/labelled-checkbox-input"
import LabelledNumberInput from "../../shared/labelled-number-input/labelled-number-input"
import LabelledTextInput from "../../shared/labelled-text-input/labelled-text-input"
import './output.scss'
import './../shared-settings.scss'
import changingSettingsService from "../../../services/changing-settings-service"

interface OutputProps {
  configChannel: CcgConfigChannel
  index: number
  outputSettings: OutputSettings
  folders: string[]
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

    const fieldCss: string = 'settings-input-field'
    const checkboxCss: string = 'settings-checkbox-field'
    return (    
        props.outputSettings &&         
            <form className="settings-channel-form">
                <label className="settings-channel-header">
                    OUTPUT {props.index + 1} :
                </label>
                <LabelledTextInput
                    labelClassName={fieldCss}
                    description="LABEL :"
                    value={label}
                    onChange={saveTempOutputLabelChange}
                />
                <Label className={fieldCss} 
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
                <Label className={fieldCss}
                    description="FORMAT :">
                    { props.configChannel.videoMode }
                </Label>
                <LabelledCheckboxInput
                    description="LOOP :"
                    labelClassName={checkboxCss}
                    value={loopState}
                    onChange={saveTempLoopChange}
                />
                <LabelledCheckboxInput
                    description="MIX :"
                    labelClassName={checkboxCss}
                    value={mixState}
                    onChange={saveTempMixChange}
                />
                <LabelledCheckboxInput
                    description="MANUAL :"
                    labelClassName={checkboxCss}
                    value={manualStartState}
                    onChange={saveTempManualChange}
                />
                <LabelledCheckboxInput
                    description="OVERLAY :"
                    labelClassName={checkboxCss}
                    value={webState}
                    onChange={saveTempWebStateChange}
                />
                <LabelledTextInput
                    labelClassName={fieldCss}
                    description="OVERLAY URL :"
                    value={webUrl}
                    onChange={saveTempWebUrlChange}
                />
                <LabelledCheckboxInput
                    description="SCALE :"
                    labelClassName={checkboxCss}
                    value={shouldScale}
                    onChange={saveTempShouldScaleChange}
                />
                {shouldScale && (
                    <>
                        <LabelledNumberInput 
                            labelClassName={fieldCss}
                            description="SCALE X :"
                            value={scaleX}
                            onChange={saveTempScaleXChange}
                            unit='px'
                        />
                        <LabelledNumberInput 
                            labelClassName={fieldCss}
                            description="SCALE Y :"
                            value={scaleY}
                            onChange={saveTempScaleYChange}
                            unit='px'
                        />
                    </>
                )}
            </form>
    )

    function saveTempOutputLabelChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newLabel = eventService.getTextFromEvent(event)
        setLabel(newLabel)
        props.outputSettings.label = newLabel
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempLoopChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newLoop = eventService.getCheckedFromEvent(event)
        setLoopState(newLoop)
        props.outputSettings.loopState = newLoop
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempMixChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newMix = eventService.getCheckedFromEvent(event)
        setMixState(newMix)
        props.outputSettings.mixState = newMix
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }

    function saveTempManualChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newManual = eventService.getCheckedFromEvent(event)
        setManualStartState(newManual)
        props.outputSettings.manualStartState = newManual
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempShouldScaleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newShouldScale = eventService.getCheckedFromEvent(event)
        setShouldScale(newShouldScale)
        props.outputSettings.shouldScale = newShouldScale
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempScaleXChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newScaleX = eventService.getNumberFromEvent(event)
        setScaleX(newScaleX)
        props.outputSettings.scaleX = newScaleX
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempScaleYChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newScaleY = eventService.getNumberFromEvent(event)
        setScaleY(newScaleY)
        props.outputSettings.scaleY = newScaleY
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempWebStateChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newWebState = eventService.getCheckedFromEvent(event)
        setWebState(newWebState)
        props.outputSettings.webState = newWebState
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }

    function saveTempWebUrlChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newWebUrl = eventService.getTextFromEvent(event)
        setWebUrl(newWebUrl)
        props.outputSettings.webUrl = newWebUrl
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempTabMediaFolderChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        const newFolder = event.target.value
        setFolder(newFolder)
        props.outputSettings.folder = newFolder
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }    
}



