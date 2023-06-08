import React, { useEffect, useState } from 'react'
import Outputs from '../outputs'
import SettingsActions from '../settings-actions/settings-actions'
import { useSelector } from 'react-redux'

import CasparcgSettings from '../casparcg-settings/casparcg-settings'
import browserService from '../../../services/browser-service'
import './settings.scss'
import changingSettingsService from '../../../services/changing-settings-service'
import { State } from '../../../../shared/reducers/index-reducer'
import settingsService from '../../../../shared/services/settings-service'
import { GenericSettings } from '../../../../shared/models/settings-models'
import { state } from '../../../../shared/store'

export function Settings(): JSX.Element { 
    useSelector((state: State) => settingsService.getGenericSettings(state.settings))
    const [settings, setSettings] = useState<GenericSettings>()    
    useEffect(() => {  
        changingSettingsService.initStateHandler(settings, setSettings)
        changingSettingsService.saveClone(settingsService.getGenericSettings(state.settings))
        return () => changingSettingsService.resetStateHandler()        
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
