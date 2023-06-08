import React from "react"
import Checkbox from "../../shared/checkbox/checkbox"
import NumberInput from "../../shared/number-input/number-input"
import TextInput from "../../shared/text-input/text-input"
import './output.scss'
import './../shared-settings.scss'
import changingSettingsService from "../../../services/changing-settings-service"
import Label from "../../shared/label/label"
import { CaspercgConfigChannel, OutputSettings } from "../../../../shared/models/settings-models"

interface OutputProps {
  configChannel: CaspercgConfigChannel
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
                            (path: string) => (
                                    <option key={path} value={path}>
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
                <Checkbox
                    description="LOOP :"
                    className={checkboxCss}
                    checked={loopState}
                    onChange={saveTempLoopChange}
                />
                <Checkbox
                    description="MIX :"
                    className={checkboxCss}
                    checked={mixState}
                    onChange={saveTempMixChange}
                />
                <Checkbox
                    description="MANUAL :"
                    className={checkboxCss}
                    checked={manualStartState}
                    onChange={saveTempManualChange}
                />
                <Checkbox
                    description="OVERLAY :"
                    className={checkboxCss}
                    checked={webState}
                    onChange={saveTempWebStateChange}
                />
                <TextInput
                    className={fieldCss}
                    description="OVERLAY URL :"
                    value={webUrl}
                    onChange={saveTempWebUrlChange}
                />
                <Checkbox
                    description="SCALE :"
                    className={checkboxCss}
                    checked={shouldScale}
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
        const newLabel = event.target.value
        props.outputSettings.label = newLabel
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempLoopChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newLoop = event.target.checked
        props.outputSettings.loopState = newLoop
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempMixChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newMix = event.target.checked
        props.outputSettings.mixState = newMix
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }

    function saveTempManualChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newManual = event.target.checked
        props.outputSettings.manualStartState = newManual
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempShouldScaleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newShouldScale = event.target.checked
        props.outputSettings.shouldScale = newShouldScale
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempScaleXChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newScaleX = Number(event.target.value)
        props.outputSettings.scaleX = newScaleX
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempScaleYChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newScaleY = Number(event.target.value)
        props.outputSettings.scaleY = newScaleY
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempWebStateChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newWebState = event.target.checked
        props.outputSettings.webState = newWebState
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }

    function saveTempWebUrlChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newWebUrl = event.target.value
        props.outputSettings.webUrl = newWebUrl
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }
    
    function saveTempTabMediaFolderChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        const newFolder = event.target.value
        props.outputSettings.folder = newFolder
        changingSettingsService.saveTemporaryOutputSettingChange(props.outputSettings, props.index)
    }    
}



