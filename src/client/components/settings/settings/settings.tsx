import React, { useEffect, useState } from 'react'
import Outputs from '../outputs'
import SettingsActions from '../settings-actions/settings-actions'
import { useSelector } from 'react-redux'
import settingsService from '../../../../model/services/settings-service'
import { State } from '../../../../model/reducers/index-reducer'
import { state } from '../../../../model/reducers/store'
import CasparcgSettings from '../casparcg-settings/casparcg-settings'
import browserService from '../../../services/browser-service'
import './settings.scss'
import changingSettingsService from '../../../services/changing-settings-service'
import { GenericSettings } from '../../../../model/reducers/settings-models'

export function Settings(): JSX.Element { 
    useSelector((state: State) => settingsService.getGenericSettings(state.settings))
    const [settings, setSettings] = useState<GenericSettings | undefined>(undefined)    
    useEffect(() => {  
        changingSettingsService.initStateHandler(settings, setSettings)
        changingSettingsService.saveClone(settingsService.getGenericSettings(state.settings))
        return () => {
            changingSettingsService.resetStateHandler()
        }
    }, [])
    return (
        <div className="settings-body">
            <p className="settings-header">SETTINGS :</p>
            <SettingsActions/>
            <hr/>
            {!browserService.isChannelView() && settings && <CasparcgSettings settings={settings.ccgSettings}/> }
            {settings && <Outputs outputSettings={settings.outputSettings}/>}
        </div>
    )

}
