import React, { useEffect, useState } from "react"
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
        props.output ?         
            <form className="Settings-channel-form">
                <label className="settings-channel-header">
                    OUTPUT {props.index + 1} :
                </label>
                <SettingsInput 
                    preDescription="LABEL :"
                    name={props.index}
                    type={SettingsInputType.TEXT}
                    value={label}
                    onChange={(event) => handleOutputLabel(event)}
                />
                <label className="Settings-input-field">
                    MEDIA FOLDER :
                    <br />
                    <select
                        className="settings-select"
                        name={String(props.index)}
                        onChange={(event) => handleTabMediaFolder(event)}
                        value={ folder }
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
                    {props.configChannel 
                    ? props.configChannel.videoMode 
                    : reduxState.settings[0].ccgConfig.channels[props.index].videoMode}
                </label>
                <SettingsInput 
                    preDescription="LOOP :"
                    name={props.index}
                    type={SettingsInputType.CHECKBOX}
                    value={loopState}
                    onChange={(event) => handleLoop(event)}
                />
                <SettingsInput 
                    preDescription="MIX :"
                    name={props.index}
                    type={SettingsInputType.CHECKBOX}
                    value={mixState}
                    onChange={(event) => handleMix(event)}
                />
                <SettingsInput 
                    preDescription="MANUAL :"
                    name={props.index}
                    type={SettingsInputType.CHECKBOX}
                    value={manualStartState}
                    onChange={(event) => handleManual(event)}
                />
                <SettingsInput 
                    preDescription="OVERLAY :"
                    name={props.index}
                    type={SettingsInputType.CHECKBOX}
                    value={webState}
                    onChange={(event) => handleWebState(event)}
                />
                <SettingsInput 
                    preDescription="OVERLAY URL :"
                    name={props.index}
                    type={SettingsInputType.TEXT}
                    value={webUrl}
                    onChange={(event) => handleWebUrl(event)}
                />
                <SettingsInput 
                    preDescription="SCALE :"
                    name={props.index}
                    type={SettingsInputType.CHECKBOX}
                    value={shouldScale}
                    onChange={(event) => handleScale(event)}
                />
                {shouldScale ? (
                    <React.Fragment>
                        <SettingsInput 
                            preDescription="SCALE X :"
                            name={props.index}
                            type={SettingsInputType.NUMBER}
                            value={scaleX}
                            onChange={(event) => handleScaleX(event)}
                            postDescription='px'
                        />
                        <SettingsInput 
                            preDescription="SCALE Y :"
                            name={props.index}
                            type={SettingsInputType.NUMBER}
                            value={scaleY}
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
        const newLabel = getTextFromEvent(event)
        setLabel(newLabel)
        props.output.label = newLabel
    }
    
    function handleLoop(event: React.ChangeEvent<HTMLInputElement>) {
        const newLoop = getCheckedFromEvent(event)
        setLoopState(newLoop)
        props.output.loopState = newLoop
    }
    
    function handleMix(event: React.ChangeEvent<HTMLInputElement>) {
        const newMix = getCheckedFromEvent(event)
        setMixState(newMix)
        props.output.mixState = newMix
    }

    function handleManual(event: React.ChangeEvent<HTMLInputElement>) {
        const newManual = getCheckedFromEvent(event)
        setManualStartState(newManual)
        props.output.manualStartState = newManual
    }
    
    function handleScale(event: React.ChangeEvent<HTMLInputElement>) {
        const newShouldScale = getCheckedFromEvent(event)
        setShouldScale(newShouldScale)
        props.output.shouldScale = newShouldScale
    }
    
    function handleScaleX(event: React.ChangeEvent<HTMLInputElement>) {
        const newScaleX = getNumberFromEvent(event)
        setScaleX(newScaleX)
        props.output.scaleX = newScaleX
    }
    
    function handleScaleY(event: React.ChangeEvent<HTMLInputElement>) {
        const newScaleY = getNumberFromEvent(event)
        setScaleY(newScaleY)
        props.output.scaleY = newScaleY
    }
    
    function handleWebState(event: React.ChangeEvent<HTMLInputElement>) {
        const newWebState = getCheckedFromEvent(event)
        setWebState(newWebState)
        props.output.webState = newWebState
    }

    function handleWebUrl(event: React.ChangeEvent<HTMLInputElement>) {
        const newWebUrl = getTextFromEvent(event)
        setWebUrl(newWebUrl)
        props.output.webUrl = newWebUrl
    }
    
    function handleTabMediaFolder(event: React.ChangeEvent<HTMLSelectElement>) {
        const newFolder = event.target.value
        setFolder(newFolder)
        props.output.folder = newFolder
    }    
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

