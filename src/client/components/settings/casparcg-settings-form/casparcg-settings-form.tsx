import React from "react";
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
    const ip = props.settings.ip
    const amcpPort = props.settings.amcpPort
    const oscPort = props.settings.oscPort
    const defaultLayer = props.settings.defaultLayer
    const transitionTime = props.settings.transitionTime
  
    const fieldCss: string = 'settings-input-field'
    return (
        <form className="settings-form">
            <div className="settings-channel-form">
                <TextInput
                    className={fieldCss}
                    description="IP ADDRESS :"
                    value={ip}
                    onChange={saveTempIpChange}
                />
                <NumberInput 
                    className={fieldCss}
                    description="AMCP PORT :"
                    value={amcpPort}
                    onChange={saveTempAmcpPortChange}
                />
                <NumberInput 
                    className={fieldCss}
                    description="OSC PORT (into ClipTool) :"
                    value={oscPort}
                    onChange={saveTempOscPortChange}
                />
                <NumberInput 
                    className={fieldCss}
                    description="DEFAULT LAYER :"
                    value={defaultLayer}
                    onChange={saveTempDefaultLayerChange}
                />
                <NumberInput 
                    className={fieldCss}
                    description="TRANSITION TIME :"
                    value={transitionTime}
                    onChange={saveTempTransitionTimeChange}
                />
            </div>
            <hr/>
        </form>
    )
    
    function saveTempIpChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newIp = eventService.getTextFromEvent(event)
        props.settings.ip = newIp
        changingSettingsService.saveTemporaryCcgSettingChanges(props.settings)
    }

    function saveTempAmcpPortChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newAmcpPort = eventService.getNumberFromEvent(event)
        props.settings.amcpPort = newAmcpPort
        changingSettingsService.saveTemporaryCcgSettingChanges(props.settings)
    }

    function saveTempOscPortChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newOscPort = eventService.getNumberFromEvent(event)
        props.settings.oscPort = newOscPort
        changingSettingsService.saveTemporaryCcgSettingChanges(props.settings)
    }

    function saveTempDefaultLayerChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newDefaultLayer = eventService.getNumberFromEvent(event)
        props.settings.defaultLayer = newDefaultLayer
        changingSettingsService.saveTemporaryCcgSettingChanges(props.settings)
    }

    function saveTempTransitionTimeChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newTransitionTime = eventService.getNumberFromEvent(event)
        props.settings.transitionTime = newTransitionTime
        changingSettingsService.saveTemporaryCcgSettingChanges(props.settings)
    }
}