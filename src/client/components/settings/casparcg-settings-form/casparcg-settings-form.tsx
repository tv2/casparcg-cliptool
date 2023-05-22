import React, { useState } from "react";
import eventService from "../../../services/event-service";
import NumberInput from "../../shared/number-input/number-input";
import TextInput from "../../shared/text-input/text-input";
import './casparcg-settings-form.scss'
import './../shared-settings.scss'
import changingSettingsService from "../../../services/changing-settings-service";
import { CasparcgSettings } from "../../../../model/reducers/settings-models";

interface CasparcgSettingsFormProps {
    settings: CasparcgSettings
}

export default function CasparcgSettingsForm(props: CasparcgSettingsFormProps): JSX.Element {
    const [ip, setIp] = useState(props.settings.ip)
    const [amcpPort, setAmcpPort] = useState(props.settings.amcpPort)
    const [oscPort, setOscPort] = useState(props.settings.oscPort)
    const [defaultLayer, setDefaultLayer] = useState(props.settings.defaultLayer)
    const [transitionTime, setTransitionTime] = useState(props.settings.transitionTime)
  
    const fieldCss: string = 'settings-input-field'
    return (
        <form className="settings-form">
            <div className="settings-channel-form">
                <TextInput
                    wrapperClassName={fieldCss}
                    description="IP ADDRESS :"
                    value={ip}
                    onChange={saveTempIpChange}
                />
                <NumberInput 
                    wrapperClassName={fieldCss}
                    description="AMCP PORT :"
                    value={amcpPort}
                    onChange={saveTempAmcpPortChange}
                />
                <NumberInput 
                    wrapperClassName={fieldCss}
                    description="OSC PORT (into ClipTool) :"
                    value={oscPort}
                    onChange={saveTempOscPortChange}
                />
                <NumberInput 
                    wrapperClassName={fieldCss}
                    description="DEFAULT LAYER :"
                    value={defaultLayer}
                    onChange={saveTempDefaultLayerChange}
                />
                <NumberInput 
                    wrapperClassName={fieldCss}
                    description="TRANSITION TIME :"
                    value={transitionTime}
                    onChange={saveTempTransitionTimeChange}
                />
            </div>
            <hr/>
        </form>
    )
    
    function saveTempIpChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.settings }
        const newIp = eventService.getTextFromEvent(event)
        setIp(newIp)
        settings.ip = newIp
        changingSettingsService.saveTemporaryCcgSettingChanges(settings)
    }

    function saveTempAmcpPortChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.settings }
        const newAmcpPort = eventService.getNumberFromEvent(event)
        setAmcpPort(newAmcpPort)
        settings.amcpPort = newAmcpPort
        changingSettingsService.saveTemporaryCcgSettingChanges(settings)
    }

    function saveTempOscPortChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.settings }
        const newOscPort = eventService.getNumberFromEvent(event)
        setOscPort(newOscPort)
        settings.oscPort = newOscPort
        changingSettingsService.saveTemporaryCcgSettingChanges(settings)
    }

    function saveTempDefaultLayerChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.settings }
        const newDefaultLayer = eventService.getNumberFromEvent(event)
        setDefaultLayer(newDefaultLayer)
        settings.defaultLayer = newDefaultLayer
        changingSettingsService.saveTemporaryCcgSettingChanges(settings)
    }

    function saveTempTransitionTimeChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const settings = { ...props.settings }
        const newTransitionTime = eventService.getNumberFromEvent(event)
        setTransitionTime(newTransitionTime)
        settings.transitionTime = newTransitionTime
        changingSettingsService.saveTemporaryCcgSettingChanges(settings)
    }
}