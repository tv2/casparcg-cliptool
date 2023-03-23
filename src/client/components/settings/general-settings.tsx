import React, { useState } from "react";
import { CcgSettings } from "../../../model/reducers/settingsModels";
import '../../css/Settings.css'
import eventService from "../../services/eventService";
import SettingsInput, { SettingsInputType } from "./settingsInput";

interface GeneralSettingsProps {
    ccgSettings: CcgSettings
    onCcgSettingsChange: (settings: CcgSettings) => void
}

export default function GeneralSettings(props: GeneralSettingsProps): JSX.Element {
    const [ip, setIp] = useState(props.ccgSettings.ip)
    const [amcpPort, setAmcpPort] = useState(props.ccgSettings.amcpPort)
    const [oscPort, setOscPort] = useState(props.ccgSettings.oscPort)
    const [defaultLayer, setDefaultLayer] = useState(props.ccgSettings.defaultLayer)
    const [transitionTime, setTransitionTime] = useState(props.ccgSettings.transitionTime)
  
    return (
        <form className="Settings-form">
            <div className="Settings-channel-form">
                <SettingsInput 
                   preDescription="IP ADDRESS :"
                   type={SettingsInputType.TEXT}
                   value={ip}
                   onChange={saveTempIpChange}
                />
                <SettingsInput 
                   preDescription="AMCP PORT :"
                   type={SettingsInputType.NUMBER}
                   value={amcpPort}
                   onChange={saveTempAmcpPortChange}
                />
                <SettingsInput 
                   preDescription="OSC PORT (into ClipTool) :"
                   type={SettingsInputType.NUMBER}
                   value={oscPort}
                   onChange={saveTempOscPortChange}
                />
                <SettingsInput 
                   preDescription="DEFAULT LAYER :"
                   type={SettingsInputType.NUMBER}
                   value={defaultLayer}
                   onChange={saveTempDefaultLayerChange}
                />
                <SettingsInput 
                   preDescription="TRANSITION TIME :"
                   type={SettingsInputType.NUMBER}
                   value={transitionTime}
                   onChange={saveTempTransitionTimeChange}
                />
            </div>
            <hr />
        </form>
    )
    
    function saveTempIpChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.ccgSettings }
        const newIp = eventService.getTextFromEvent(event)
        setIp(newIp)
        settings.ip = newIp
        props.onCcgSettingsChange(settings)
    }

    function saveTempAmcpPortChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.ccgSettings }
        const newAmcpPort = eventService.getNumberFromEvent(event)
        setAmcpPort(newAmcpPort)
        settings.amcpPort = newAmcpPort
        props.onCcgSettingsChange(settings)
    }

    function saveTempOscPortChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.ccgSettings }
        const newOscPort = eventService.getNumberFromEvent(event)
        setOscPort(newOscPort)
        settings.oscPort = newOscPort
        props.onCcgSettingsChange(settings)
    }

    function saveTempDefaultLayerChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.ccgSettings }
        const newDefaultLayer = eventService.getNumberFromEvent(event)
        setDefaultLayer(newDefaultLayer)
        settings.defaultLayer = newDefaultLayer
        props.onCcgSettingsChange(settings)
    }

    function saveTempTransitionTimeChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.ccgSettings }
        const newTransitionTime = eventService.getNumberFromEvent(event)
        setTransitionTime(newTransitionTime)
        settings.transitionTime = newTransitionTime
        props.onCcgSettingsChange(settings)
    }
}