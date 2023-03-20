import React, { useState } from "react";
import { GenericSettings } from "../../../model/reducers/settingsModels";
import '../../css/Settings.css'
import eventService from "../../services/eventService";
import SettingsInput, { SettingsInputType } from "./settingsInput";

interface GeneralSettingsProps {
    settings: GenericSettings
    setSettings: (GenericSettings: GenericSettings) => void
}

export default function GeneralSettings(props: GeneralSettingsProps): JSX.Element {
    const [ccgIp, setCcgIp] = useState(props.settings.ccgIp)
    const [ccgAmcpPort, setCcgAmcpPort] = useState(props.settings.ccgAmcpPort)
    const [ccgOscPort, setCcgOscPort] = useState(props.settings.ccgOscPort)
    const [ccgDefaultLayer, setCcgDefaultLayer] = useState(props.settings.ccgDefaultLayer)
    const [ccgTransitionTime, setCcgTransitionTime] = useState(props.settings.transitionTime)
  
    return (
        <form className="Settings-form">
            <div className="Settings-channel-form">
                <SettingsInput 
                   preDescription="IP ADDRESS :"
                   name="ccgIp"
                   type={SettingsInputType.TEXT}
                   value={ccgIp}
                   onChange={handleCcgIp}
                />
                <SettingsInput 
                   preDescription="AMCP PORT :"
                   name="ccgAmcpPort"
                   type={SettingsInputType.NUMBER}
                   value={ccgAmcpPort}
                   onChange={handleCcgAmcpPort}
                />
                <SettingsInput 
                   preDescription="OSC PORT (into ClipTool) :"
                   name="ccgOscPort"
                   type={SettingsInputType.NUMBER}
                   value={ccgOscPort}
                   onChange={handleCcgOscPort}
                />
                <SettingsInput 
                   preDescription="DEFAULT LAYER :"
                   name="ccgDefaultLayer"
                   type={SettingsInputType.NUMBER}
                   value={ccgDefaultLayer}
                   onChange={handleCcgDefaultLayer}
                />
                <SettingsInput 
                   preDescription="TRANSITION TIME :"
                   name="transitionTime"
                   type={SettingsInputType.NUMBER}
                   value={ccgTransitionTime}
                   onChange={handleCcgTransitionTime}
                />
            </div>
            <hr />
        </form>
    )
    
    function handleCcgIp(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.settings }
        const newCcgIp = eventService.getTextFromEvent(event)
        setCcgIp(newCcgIp)
        settings.ccgIp = newCcgIp
        props.setSettings(settings)
    }

    function handleCcgAmcpPort(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.settings }
        const newCcgAmcpPort = eventService.getNumberFromEvent(event)
        setCcgAmcpPort(newCcgAmcpPort)
        settings.ccgAmcpPort = newCcgAmcpPort
        props.setSettings(settings)
    }

    function handleCcgOscPort(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.settings }
        const newCcgOscPort = eventService.getNumberFromEvent(event)
        setCcgOscPort(newCcgOscPort)
        settings.ccgOscPort = newCcgOscPort
        props.setSettings(settings)
    }

    function handleCcgDefaultLayer(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.settings }
        const newCcgDefaultLayer = eventService.getNumberFromEvent(event)
        setCcgDefaultLayer(newCcgDefaultLayer)
        settings.ccgDefaultLayer = newCcgDefaultLayer
        props.setSettings(settings)
    }

    function handleCcgTransitionTime(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.settings }
        const newCcgTransitionTime = eventService.getNumberFromEvent(event)
        setCcgTransitionTime(newCcgTransitionTime)
        settings.transitionTime = newCcgTransitionTime
        props.setSettings(settings)
    }
}