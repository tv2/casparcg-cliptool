import React, { useState } from 'react'
import OutputsForm from '../../../settings-page/components/outputs/outputs'
import SettingsActions from '../settings-actions/settings-actions'
import CasparcgForm from '../casparcg-settings/casparcg-settings'
import './settings-page.scss'
import { CasparcgSettings, GenericSettings, OutputSettings } from '../../../../shared/models/settings-models'
import { state } from '../../../../shared/store'
import _ from 'lodash'
import { BrowserService } from '../../../shared/services/browser-service'

export function SettingsPage(): JSX.Element { 
    const [settings, setSettings] = useState<GenericSettings>(deepClone(state.settings.generics))  

    function onOutputsChanged(changedOutputs: OutputSettings[]): void {
        settings.outputSettings = changedOutputs
        setSettings({ ...settings })
    }

    function onCasparcgChanged(changedCasparcg: CasparcgSettings): void {
        settings.ccgSettings = changedCasparcg
        setSettings({ ...settings })
    }

    return (
        <div className="c-settings-page">
            <p className="c-settings-page__header">SETTINGS :</p>
            <SettingsActions settings={settings} onChange={(changedOutputs) => onOutputsChanged(changedOutputs)}/>
            <hr/>
            {!new BrowserService().isChannelView() && settings && <CasparcgForm casparcgSettings={settings.ccgSettings} onChange={(changedCasparcg) => onCasparcgChanged(changedCasparcg)}/> }
            {settings && <OutputsForm outputSettings={settings.outputSettings} onChange={(changedOutputs) => onOutputsChanged(changedOutputs)}/>}
        </div>
    )
}

function deepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value))
}

