import React, { useState } from 'react'
import '../../css/Settings.css'
import Outputs from './outputs'
import SettingsButtons from './settings-buttons'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import settingsService from '../../../model/services/settingsService'
import { ReduxStateType } from '../../../model/reducers/indexReducer'
import { reduxState } from '../../../model/reducers/store'
import GeneralSettings from './general-settings'
import { CcgSettings, GenericSettings, OutputSettings } from '../../../model/reducers/settingsModels'

// Check if URL has a specific channel:
const channel: string | null = new URLSearchParams(window.location.search).get('channel')
const specificChannel = channel ? parseInt(channel) || 0 : 0

export function Settings(): JSX.Element { 
    useSelector((storeUpdate: ReduxStateType) => settingsService.getGenericSettings(storeUpdate.settings))
    const [settings, setSettings] = useState(_.cloneDeep(settingsService.getGenericSettings(reduxState.settings)))    

    return (
        <div className="Settings-body">
            <p className="Settings-header">SETTINGS :</p>
            <SettingsButtons specificChannel={specificChannel} settings={settings}/>
            <hr/>
            {!specificChannel && <GeneralSettings ccgSettings={settings.ccgSettings} onCcgSettingsChange={saveTempCcgSettingChanges}/> }
            <Outputs specificChannel={specificChannel} outputSettings={settings.outputSettings} onOutputSettingsChange={saveTempOutputSettingsChange}/>
        </div>
    )

    function saveTempCcgSettingChanges(ccgSettings: CcgSettings): void {
        const settingsCopy: GenericSettings = { ...settings }
        settingsCopy.ccgSettings = ccgSettings
        setSettings(settingsCopy)
    }

    function saveTempOutputSettingsChange(outputSettings: OutputSettings[]) {
        const settingsCopy: GenericSettings = { ...settings }
        settingsCopy.outputSettings = outputSettings
    }
}
