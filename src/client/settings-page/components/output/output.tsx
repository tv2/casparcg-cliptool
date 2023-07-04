import React from "react"
import './output.scss'
import './../shared.scss'
import { CaspercgConfigChannel, OperationMode, OutputSettings } from "../../../../shared/models/settings-models"
import TextInput from "../text-input/text-input"
import Label from "../label/label"
import Checkbox from "../checkbox/checkbox"
import NumberInput from "../number-input/number-input"
import { UtilityService } from "../../../../shared/services/utility-service"

interface OutputProps {
  configChannel: CaspercgConfigChannel
  index: number
  outputSettings: OutputSettings
  folders: string[]
  onChange: (changedOutput: OutputSettings) => void
}

export default function Output(props: OutputProps): JSX.Element {
    const label = props.outputSettings.label
    const folder = props.outputSettings.folder
    const operationMode = new UtilityService().convertScreamingSnakeCaseToPascalCase(props.outputSettings.operationMode) 
    const loopState = props.outputSettings.loopState
    const mixState = props.outputSettings.mixState
    const manualStartState = props.outputSettings.manualStartState
    const webState = props.outputSettings.webState
    const webUrl = props.outputSettings.webUrl
    const shouldScale = props.outputSettings.shouldScale
    const scaleX = props.outputSettings.scaleX
    const scaleY = props.outputSettings.scaleY    

    return (    
        props.outputSettings &&         
            <form className="settings-channel-form">
                <label className="settings-channel-header">
                    OUTPUT {props.index + 1} :
                </label>
                <TextInput
                    description="LABEL :"
                    value={label}
                    onChange={saveTempOutputLabelChange}
                />
                <Label className="settings-input-field" 
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
                <Label className="settings-input-field" 
                    description="OPERATION MODE :">
                    <select
                        className="settings-select"
                        name={String(props.index)}
                        onChange={saveTempOperationModeChange}
                        value={ operationMode }
                    >
                        {(Object.keys(OperationMode) as Array<keyof typeof OperationMode>).map(
                            (snakeCase: string) => {
                                const pascal = new UtilityService().convertScreamingSnakeCaseToPascalCase(snakeCase)
                                return (
                                    <option key={pascal} value={pascal}>
                                        {pascal}
                                    </option>
                                )
                            }                        
                        )}
                    </select>
                </Label>
                <Label className="settings-input-field"
                    description="FORMAT :">
                    { props.configChannel.videoMode }
                </Label>
                <Checkbox
                    description="LOOP :"
                    checked={loopState}
                    onChange={saveTempLoopChange}
                />
                <Checkbox
                    description="MIX :"
                    checked={mixState}
                    onChange={saveTempMixChange}
                />
                <Checkbox
                    description="MANUAL :"
                    checked={manualStartState}
                    onChange={saveTempManualChange}
                />
                <Checkbox
                    description="OVERLAY :"
                    checked={webState}
                    onChange={saveTempWebStateChange}
                />                
                <TextInput
                    description="OVERLAY URL :"
                    value={webUrl}
                    onChange={saveTempWebUrlChange}
                />
                <Checkbox
                    description="SCALE :"
                    checked={shouldScale}
                    onChange={saveTempShouldScaleChange}
                />
                {shouldScale && (
                    <>
                        <NumberInput 
                            description="SCALE X :"
                            value={scaleX}
                            onChange={saveTempScaleXChange}
                            unit='px'
                        />
                        <NumberInput 
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
        props.onChange(props.outputSettings)
    }
    
    function saveTempLoopChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newLoop = event.target.checked
        props.outputSettings.loopState = newLoop
        props.onChange(props.outputSettings)
    }
    
    function saveTempMixChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newMix = event.target.checked
        props.outputSettings.mixState = newMix
        props.onChange(props.outputSettings)
    }

    function saveTempManualChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newManual = event.target.checked
        props.outputSettings.manualStartState = newManual
        props.onChange(props.outputSettings)
    }
    
    function saveTempShouldScaleChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newShouldScale = event.target.checked
        props.outputSettings.shouldScale = newShouldScale
        props.onChange(props.outputSettings)
    }
    
    function saveTempScaleXChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newScaleX = Number(event.target.value)
        props.outputSettings.scaleX = newScaleX
        props.onChange(props.outputSettings)
    }
    
    function saveTempScaleYChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newScaleY = Number(event.target.value)
        props.outputSettings.scaleY = newScaleY
        props.onChange(props.outputSettings)
    }
    
    function saveTempWebStateChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newWebState = event.target.checked
        props.outputSettings.webState = newWebState
        props.onChange(props.outputSettings)
    }

    function saveTempWebUrlChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newWebUrl = event.target.value
        props.outputSettings.webUrl = newWebUrl
        props.onChange(props.outputSettings)
    }
    
    function saveTempTabMediaFolderChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        const newFolder = event.target.value
        props.outputSettings.folder = newFolder
        props.onChange(props.outputSettings)
    }
    
    function saveTempOperationModeChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        const rawNewOperationMode = event.target.value
        const convertedRawNewOperationMode = new UtilityService().convertPascasCaseToScreamingSnakeCase(rawNewOperationMode)
        const newOperationMode = OperationMode[convertedRawNewOperationMode as keyof typeof OperationMode]
        props.outputSettings.operationMode = newOperationMode
        props.onChange(props.outputSettings)
    }
}



