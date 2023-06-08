import React from "react";
import NumberInput from "../../shared/number-input/number-input";
import TextInput from "../../shared/text-input/text-input";
import './casparcg-settings.scss'
import './../shared-settings.scss'
import changingSettingsService from "../../../services/changing-settings-service";
import { CasparcgSettings } from "../../../../shared/models/settings-models";

interface CasparcgSettingsForm {
    settings: CasparcgSettings
}

export default function CasparcgSettings(props: CasparcgSettingsForm): JSX.Element {
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
        const newIp = event.target.value
        props.settings.ip = newIp
        changingSettingsService.saveTemporaryCcgSettingChanges(props.settings)
    }

    function saveTempAmcpPortChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newAmcpPort = Number(event.target.value)
        props.settings.amcpPort = newAmcpPort
        changingSettingsService.saveTemporaryCcgSettingChanges(props.settings)
    }

    function saveTempOscPortChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newOscPort = Number(event.target.value)
        props.settings.oscPort = newOscPort
        changingSettingsService.saveTemporaryCcgSettingChanges(props.settings)
    }

    function saveTempDefaultLayerChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newDefaultLayer = Number(event.target.value)
        props.settings.defaultLayer = newDefaultLayer
        changingSettingsService.saveTemporaryCcgSettingChanges(props.settings)
    }

    function saveTempTransitionTimeChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newTransitionTime = Number(event.target.value)
        props.settings.transitionTime = newTransitionTime
        changingSettingsService.saveTemporaryCcgSettingChanges(props.settings)
    }
}