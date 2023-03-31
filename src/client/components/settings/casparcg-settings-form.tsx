import React, { useState } from "react";
import { CasparcgSettings } from "../../../model/reducers/settings-models";
import '../../css/Settings.css'
import eventService from "../../services/event-service";
import LabelledNumberInput from "../shared/labelled-number-input";
import LabelledTextInput from "../shared/labelled-text-input";

interface CasparcgSettingsFormProps {
    settings: CasparcgSettings
    onSettingsChange: (settings: CasparcgSettings) => void
}

export default function CasparcgSettingsForm(props: CasparcgSettingsFormProps): JSX.Element {
    const [ip, setIp] = useState(props.settings.ip)
    const [amcpPort, setAmcpPort] = useState(props.settings.amcpPort)
    const [oscPort, setOscPort] = useState(props.settings.oscPort)
    const [defaultLayer, setDefaultLayer] = useState(props.settings.defaultLayer)
    const [transitionTime, setTransitionTime] = useState(props.settings.transitionTime)
  
    return (
        <form className="Settings-form">
            <div className="Settings-channel-form">
                <LabelledTextInput
                    labelClassName="Settings-input-field"
                    description="OVERLAY URL :"
                    value={ip}
                    onChange={saveTempIpChange}
                />
                <LabelledNumberInput 
                    labelClassName="Settings-input-field"
                    description="AMCP PORT :"
                    value={amcpPort}
                    onChange={saveTempAmcpPortChange}
                />
                <LabelledNumberInput 
                    labelClassName="Settings-input-field"
                    description="OSC PORT (into ClipTool) :"
                    value={oscPort}
                    onChange={saveTempOscPortChange}
                />
                <LabelledNumberInput 
                    labelClassName="Settings-input-field"
                    description="DEFAULT LAYER :"
                    value={defaultLayer}
                    onChange={saveTempDefaultLayerChange}
                />
                <LabelledNumberInput 
                    labelClassName="Settings-input-field"
                    description="TRANSITION TIME :"
                    value={transitionTime}
                    onChange={saveTempTransitionTimeChange}
                />
            </div>
            <hr />
        </form>
    )
    
    function saveTempIpChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.settings }
        const newIp = eventService.getTextFromEvent(event)
        setIp(newIp)
        settings.ip = newIp
        props.onSettingsChange(settings)
    }

    function saveTempAmcpPortChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.settings }
        const newAmcpPort = eventService.getNumberFromEvent(event)
        setAmcpPort(newAmcpPort)
        settings.amcpPort = newAmcpPort
        props.onSettingsChange(settings)
    }

    function saveTempOscPortChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.settings }
        const newOscPort = eventService.getNumberFromEvent(event)
        setOscPort(newOscPort)
        settings.oscPort = newOscPort
        props.onSettingsChange(settings)
    }

    function saveTempDefaultLayerChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.settings }
        const newDefaultLayer = eventService.getNumberFromEvent(event)
        setDefaultLayer(newDefaultLayer)
        settings.defaultLayer = newDefaultLayer
        props.onSettingsChange(settings)
    }

    function saveTempTransitionTimeChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.settings }
        const newTransitionTime = eventService.getNumberFromEvent(event)
        setTransitionTime(newTransitionTime)
        settings.transitionTime = newTransitionTime
        props.onSettingsChange(settings)
    }
}