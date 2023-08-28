import React from 'react'
import './casparcg-settings.scss'
import './../shared.scss'
import { CasparcgSettings } from '../../../../shared/models/settings-models'
import TextInput from '../text-input/text-input'
import NumberInput from '../number-input/number-input'

interface CasparcgFormProps {
    casparcgSettings: CasparcgSettings
    onChange: (changedCasparcg: CasparcgSettings) => void
}

export default function CasparcgForm(props: CasparcgFormProps): JSX.Element {
    const {
        ip,
        amcpPort,
        oscPort,
        defaultLayer,
        transitionTime,
        bannedCharacters,
    } = props.casparcgSettings

    return (
        <form className="settings-form">
            <div className="settings-channel-form">
                <TextInput
                    description="IP ADDRESS :"
                    value={ip}
                    onChange={saveTempIpChange}
                />
                <NumberInput
                    description="AMCP PORT :"
                    value={amcpPort}
                    onChange={saveTempAmcpPortChange}
                />
                <NumberInput
                    description="OSC PORT (into ClipTool) :"
                    value={oscPort}
                    onChange={saveTempOscPortChange}
                />
                <NumberInput
                    description="DEFAULT LAYER :"
                    value={defaultLayer}
                    onChange={saveTempDefaultLayerChange}
                />
                <NumberInput
                    description="TRANSITION TIME :"
                    value={transitionTime}
                    onChange={saveTempTransitionTimeChange}
                />
                <TextInput
                    description="BANNED CHARACTERS :"
                    value={bannedCharacters}
                    onChange={saveTempBannedCharacterChange}
                />
            </div>
            <hr />
        </form>
    )

    function saveTempIpChange(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        const newIp = event.target.value
        props.casparcgSettings.ip = newIp
        props.onChange(props.casparcgSettings)
    }

    function saveTempBannedCharacterChange(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        const newBannedCharacters = event.target.value
        props.casparcgSettings.bannedCharacters = newBannedCharacters
        props.onChange(props.casparcgSettings)
    }

    function saveTempAmcpPortChange(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        const newAmcpPort = Number(event.target.value)
        props.casparcgSettings.amcpPort = newAmcpPort
        props.onChange(props.casparcgSettings)
    }

    function saveTempOscPortChange(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        const newOscPort = Number(event.target.value)
        props.casparcgSettings.oscPort = newOscPort
        props.onChange(props.casparcgSettings)
    }

    function saveTempDefaultLayerChange(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        const newDefaultLayer = Number(event.target.value)
        props.casparcgSettings.defaultLayer = newDefaultLayer
        props.onChange(props.casparcgSettings)
    }

    function saveTempTransitionTimeChange(
        event: React.ChangeEvent<HTMLInputElement>
    ): void {
        const newTransitionTime = Number(event.target.value)
        props.casparcgSettings.transitionTime = newTransitionTime
        props.onChange(props.casparcgSettings)
    }
}
