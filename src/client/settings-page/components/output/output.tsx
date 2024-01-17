import React from 'react'
import './output.scss'
import './../shared.scss'
import {
    CasparcgConfigChannel,
    OperationMode,
    OutputState,
} from '../../../../shared/models/settings-models'
import TextInput from '../text-input/text-input'
import Label from '../label/label'
import Checkbox from '../checkbox/checkbox'
import NumberInput from '../number-input/number-input'
import { UtilityService } from '../../../../shared/services/utility-service'

interface OutputProps {
    configChannel: CasparcgConfigChannel
    index: number
    outputState: OutputState
    folders: string[]
    onChange: (changedOutput: OutputState) => void
}

export default function Output(props: OutputProps): JSX.Element {
    const utilityService = new UtilityService()

    const {
        label,
        folder,
        webUrl,
        shouldScale,
        scaleX,
        scaleY,
        initialLoopState,
        initialMixState,
        initialManualStartState,
        initialWebState,
    } = props.outputState
    const operationMode = utilityService.convertScreamingSnakeCaseToPascalCase(
        props.outputState.operationMode
    )

    return (
        props.outputState && (
            <form className="settings-channel-form">
                <label className="settings-channel-header">
                    OUTPUT {props.index + 1} :
                </label>
                <TextInput
                    description="LABEL :"
                    value={label}
                    onChange={saveTempOutputLabelChange}
                />
                <Label
                    className="settings-input-field"
                    description="MEDIA FOLDER :"
                >
                    <select
                        className="settings-select"
                        title="The folder where the media files are located."
                        name={String(props.index)}
                        onChange={saveTempTabMediaFolderChange}
                        value={folder}
                    >
                        {props.folders.map((path: string) => (
                            <option key={path} value={path}>
                                {path}
                            </option>
                        ))}
                    </select>
                </Label>
                <Label
                    className="settings-input-field"
                    description="OPERATION MODE :"
                >
                    <select
                        className="settings-select"
                        title='Operation mode for the output. "PLAY" will play the media file once. "LOOP" will loop the media file. "MIX" will mix the media file with the previous media file. "MANUAL" will wait for the user to press the "PLAY" button. "OVERLAY" will show the media file as an overlay.'
                        name={String(props.index)}
                        onChange={saveTempOperationModeChange}
                        value={operationMode}
                    >
                        {(
                            Object.keys(OperationMode) as Array<
                                keyof typeof OperationMode
                            >
                        ).map((snakeCase: string) => {
                            const pascal =
                                utilityService.convertScreamingSnakeCaseToPascalCase(
                                    snakeCase
                                )
                            return (
                                <option key={pascal} value={pascal}>
                                    {pascal}
                                </option>
                            )
                        })}
                    </select>
                </Label>
                <Label className="settings-input-field" description="FORMAT :">
                    {props.configChannel.videoMode}
                </Label>
                <Checkbox
                    description="LOOP :"
                    checked={initialLoopState}
                    onChange={saveTempLoopChange}
                />
                <Checkbox
                    description="MIX :"
                    checked={initialMixState}
                    onChange={saveTempMixChange}
                />
                <Checkbox
                    description="MANUAL :"
                    checked={initialManualStartState}
                    onChange={saveTempManualChange}
                />
                <Checkbox
                    description="OVERLAY :"
                    checked={initialWebState}
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
                            unit="px"
                        />
                        <NumberInput
                            description="SCALE Y :"
                            value={scaleY}
                            onChange={saveTempScaleYChange}
                            unit="px"
                        />
                    </>
                )}
            </form>
        )
    )

    function saveTempOutputLabelChange(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        const newLabel = event.target.value
        props.outputState.label = newLabel
        props.onChange(props.outputState)
    }

    function saveTempLoopChange(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        const newLoop = event.target.checked
        props.outputState.loopState = newLoop
        props.outputState.initialLoopState = newLoop
        props.onChange(props.outputState)
    }

    function saveTempMixChange(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        const newMix = event.target.checked
        props.outputState.mixState = newMix
        props.outputState.initialMixState = newMix
        props.onChange(props.outputState)
    }

    function saveTempManualChange(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        const newManual = event.target.checked
        props.outputState.manualStartState = newManual
        props.outputState.initialManualStartState = newManual
        props.onChange(props.outputState)
    }

    function saveTempShouldScaleChange(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        const newShouldScale = event.target.checked
        props.outputState.shouldScale = newShouldScale
        props.onChange(props.outputState)
    }

    function saveTempScaleXChange(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        const newScaleX = Number(event.target.value)
        props.outputState.scaleX = newScaleX
        props.onChange(props.outputState)
    }

    function saveTempScaleYChange(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        const newScaleY = Number(event.target.value)
        props.outputState.scaleY = newScaleY
        props.onChange(props.outputState)
    }

    function saveTempWebStateChange(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        const newWebState = event.target.checked
        props.outputState.webState = newWebState
        props.outputState.initialWebState = newWebState
        props.onChange(props.outputState)
    }

    function saveTempWebUrlChange(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        const newWebUrl = event.target.value
        props.outputState.webUrl = newWebUrl
        props.onChange(props.outputState)
    }

    function saveTempTabMediaFolderChange(
        event: React.ChangeEvent<HTMLSelectElement>
    ): void {
        const newFolder = event.target.value
        props.outputState.folder = newFolder
        props.onChange(props.outputState)
    }

    function saveTempOperationModeChange(
        event: React.ChangeEvent<HTMLSelectElement>
    ): void {
        const utilityService = new UtilityService()
        const rawNewOperationMode = event.target.value
        const convertedRawNewOperationMode =
            utilityService.convertPascalCaseToScreamingSnakeCase(
                rawNewOperationMode
            )
        const newOperationMode =
            OperationMode[
                convertedRawNewOperationMode as keyof typeof OperationMode
            ]
        props.outputState.operationMode = newOperationMode
        props.onChange(props.outputState)
    }
}

