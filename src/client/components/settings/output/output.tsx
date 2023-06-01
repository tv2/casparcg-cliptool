import React from "react"
import { CcgConfigChannel, OutputSettings } from "../../../../model/reducers/settings-models"
import eventService from "../../../services/event-service"
import CheckboxInput from "../../shared/checkbox-input/checkbox-input"
import NumberInput from "../../shared/number-input/number-input"
import TextInput from "../../shared/text-input/text-input"
import './output.scss'
import './../shared-settings.scss'
import changingSettingsService from "../../../services/changing-settings-service"
import Label from "../../shared/label/label"

interface OutputProps {
  configChannel: CcgConfigChannel
  index: number
  outputSettings: OutputSettings
  folders: string[]
}

export default function Output(props: OutputProps): JSX.Element {
    const label = props.outputSettings.label
    const folder = props.outputSettings.folder
    const loopState = props.outputSettings.loopState
    const mixState = props.outputSettings.mixState
    const manualStartState = props.outputSettings.manualStartState
    const webState = props.outputSettings.webState
    const webUrl = props.outputSettings.webUrl
    const shouldScale = props.outputSettings.shouldScale
    const scaleX = props.outputSettings.scaleX
    const scaleY = props.outputSettings.scaleY

    const fieldCss: string = 'settings-input-field'
    const checkboxCss: string = 'settings-checkbox-field'
    return (    
        props.outputSettings &&         
            <form className="settings-channel-form">
                <label className="settings-channel-header">
                    OUTPUT {props.index + 1} :
                </label>
                <TextInput
                    className={fieldCss}
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
                            (path: string, folderIndex: number) => (
                                    <option key={folderIndex} value={path}>
                                        {path}
                                    </option>
                                )                            
                        )}
                    </select>
                </Label>
                <Label className={fieldCss}
                    description="FORMAT :">
                    { props.configChannel.videoMode }
                </Label>
                <CheckboxInput
                    description="LOOP :"
                    className={checkboxCss}
                    value={loopState}
                    onChange={saveTempLoopChange}
                />
                <CheckboxInput
                    description="MIX :"
                    className={checkboxCss}
                    value={mixState}
                    onChange={saveTempMixChange}
                />
                <CheckboxInput
                    description="MANUAL :"
                    className={checkboxCss}
                    value={manualStartState}
                    onChange={saveTempManualChange}
                />
                <CheckboxInput
                    description="OVERLAY :"
                    className={checkboxCss}
                    value={webState}
                    onChange={saveTempWebStateChange}
                />
                <TextInput
                    className={fieldCss}
                    description="OVERLAY URL :"
                    value={webUrl}
                    onChange={saveTempWebUrlChange}
                />
                <CheckboxInput
                    description="SCALE :"
                    className={checkboxCss}
                    value={shouldScale}
                    onChange={saveTempShouldScaleChange}
                />
                {shouldScale && (
                    <>
                        <NumberInput 
                            className={fieldCss}
                            description="SCALE X :"
                            value={scaleX}
                            onChange={saveTempScaleXChange}
                            unit='px'
                        />
                        <NumberInput 
                            className={fieldCss}
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
        props.outputSettings.label = newLabel
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempLoopChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newLoop = eventService.getCheckedFromEvent(event)
        props.outputSettings.loopState = newLoop
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempMixChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newMix = eventService.getCheckedFromEvent(event)
        props.outputSettings.mixState = newMix
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }

    function saveTempManualChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newManual = eventService.getCheckedFromEvent(event)
        props.outputSettings.manualStartState = newManual
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempShouldScaleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newShouldScale = eventService.getCheckedFromEvent(event)
        props.outputSettings.shouldScale = newShouldScale
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempScaleXChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newScaleX = eventService.getNumberFromEvent(event)
        props.outputSettings.scaleX = newScaleX
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempScaleYChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newScaleY = eventService.getNumberFromEvent(event)
        props.outputSettings.scaleY = newScaleY
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempWebStateChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newWebState = eventService.getCheckedFromEvent(event)
        props.outputSettings.webState = newWebState
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }

    function saveTempWebUrlChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newWebUrl = eventService.getTextFromEvent(event)
        props.outputSettings.webUrl = newWebUrl
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempTabMediaFolderChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        const newFolder = event.target.value
        props.outputSettings.folder = newFolder
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }    
}



