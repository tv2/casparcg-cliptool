import React from "react";
import NumberInput from "../../shared/number-input/number-input";
import TextInput from "../../shared/text-input/text-input";
import './casparcg-settings.scss'
import './../shared-settings.scss'
import { CasparcgSettings } from "../../../../shared/models/settings-models";

interface CasparcgFormProps {
    casparcgSettings: CasparcgSettings
    onChange: (changedCasparcg: CasparcgSettings) => void
}

export default function CasparcgForm(props: CasparcgFormProps): JSX.Element {
    const ip = props.casparcgSettings.ip
    const amcpPort = props.casparcgSettings.amcpPort
    const oscPort = props.casparcgSettings.oscPort
    const defaultLayer = props.casparcgSettings.defaultLayer
    const transitionTime = props.casparcgSettings.transitionTime
  
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
        props.casparcgSettings.ip = newIp
        props.onChange(props.casparcgSettings)
    }

    function saveTempAmcpPortChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newAmcpPort = Number(event.target.value)
        props.casparcgSettings.amcpPort = newAmcpPort
        props.onChange(props.casparcgSettings)
    }

    function saveTempOscPortChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newOscPort = Number(event.target.value)
        props.casparcgSettings.oscPort = newOscPort
        props.onChange(props.casparcgSettings)
    }

    function saveTempDefaultLayerChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newDefaultLayer = Number(event.target.value)
        props.casparcgSettings.defaultLayer = newDefaultLayer
        props.onChange(props.casparcgSettings)
    }

    function saveTempTransitionTimeChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const newTransitionTime = Number(event.target.value)
        props.casparcgSettings.transitionTime = newTransitionTime
        props.onChange(props.casparcgSettings)
    }
}