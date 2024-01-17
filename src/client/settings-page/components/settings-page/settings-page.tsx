import React, { useState } from 'react'
import OutputsForm from '../../../settings-page/components/outputs/outputs'
import SettingsActions from '../settings-actions/settings-actions'
import CasparcgForm from '../casparcg-settings/casparcg-settings'
import './settings-page.scss'
import { CasparcgSettings, GenericSettings, OutputState } from '../../../../shared/models/settings-models'
import { state } from '../../../../shared/store'
import _ from 'lodash'
import { BrowserService } from '../../../shared/services/browser-service'

export function SettingsPage(): JSX.Element {
    const browserService = new BrowserService()
    const isChannelView = browserService.isChannelView()
    const [settings, setSettings] = useState<GenericSettings>(deepClone(state.settings.generics))  

    function onOutputStateChanged(changedOutputs: OutputState[]): void {
        settings.outputsState = changedOutputs
        setSettings({ ...settings })
    }

    function onCasparcgSettingsChanged(changedCasparcg: CasparcgSettings): void {
        settings.ccgSettings = changedCasparcg
        setSettings({ ...settings })
    }

    return (
        <div className="c-settings-page">
            <p className="c-settings-page__header">SETTINGS :</p>
            <SettingsActions settings={settings}/>
            <hr/>
            {!isChannelView && settings && <CasparcgForm casparcgSettings={settings.ccgSettings} onChange={(changedCasparcg) => onCasparcgSettingsChanged(changedCasparcg)}/> }
            {settings && <OutputsForm outputsState={settings.outputsState} onChange={(changedOutputs) => onOutputStateChanged(changedOutputs)}/>}
        </div>
    )
}

function deepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value))
}

