import React, { useState } from 'react'
import '../../css/Settings.css'
import Outputs from './outputs'
import SettingsActions from './settings-actions'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import settingsService from '../../../model/services/settings-service'
import { State } from '../../../model/reducers/index-reducer'
import { state } from '../../../model/reducers/store'
import GeneralSettings from './general-settings'
import { CcgSettings, OutputSettings } from '../../../model/reducers/settings-models'
import browserService from '../../services/browser-service'


export function Settings(): JSX.Element { 
    useSelector((state: State) => settingsService.getGenericSettings(state.settings))
    const [settings, setSettings] = useState(deepClone(settingsService.getGenericSettings(state.settings)))    
    return (
        <div className="Settings-body">
            <p className="Settings-header">SETTINGS :</p>
            <SettingsActions settings={settings}/>
            <hr/>
            {!browserService.isChannelView() && <GeneralSettings ccgSettings={settings.ccgSettings} onCcgSettingsChange={saveTempCcgSettingChanges}/> }
            <Outputs  outputSettings={settings.outputSettings} onOutputSettingsChange={saveTempOutputSettingsChange}/>
        </div>
    )

    function saveTempCcgSettingChanges(ccgSettings: CcgSettings): void {
        setSettings({ ...settings, ccgSettings })    
    }

    function saveTempOutputSettingsChange(outputSettings: OutputSettings[]) {
        setSettings({...settings, outputSettings })
    }
}

function deepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value))
}
