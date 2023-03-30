import React, { useState } from 'react'
import '../../css/Settings.css'
import Outputs from './outputs'
import SettingsActions from './settings-actions'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import settingsService from '../../../model/services/settings-service'
import { State } from '../../../model/reducers/index-reducer'
import { reduxState } from '../../../model/reducers/store'
import GeneralSettings from './general-settings'
import { CcgSettings, GenericSettings, OutputSettings } from '../../../model/reducers/settings-models'
import browserService from '../../services/browser-service'


export function Settings(): JSX.Element { 
    useSelector((storeUpdate: State) => settingsService.getGenericSettings(storeUpdate.settings))
    const [settings, setSettings] = useState(_.cloneDeep(settingsService.getGenericSettings(reduxState.settings)))    
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
        const settingsCopy: GenericSettings = { ...settings }
        settingsCopy.ccgSettings = ccgSettings
        setSettings(settingsCopy)
    }

    function saveTempOutputSettingsChange(outputSettings: OutputSettings[]) {
        const settingsCopy: GenericSettings = { ...settings }
        settingsCopy.outputSettings = outputSettings
    }
}
