import React, { useState } from 'react'
import '../../css/Settings.css'
import Outputs from './outputs'
import SettingsButtons from './settingsButtons'
import GeneralSettings from './generalSettings'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import settingsService from '../../../model/services/settingsService'
import { ReduxStateType } from '../../../model/reducers/indexReducer'
import { reduxState } from '../../../model/reducers/store'

// Check if URL has a specific channel:
const channel: string | null = new URLSearchParams(window.location.search).get('channel')
const specificChannel = channel ? parseInt(channel) || 0 : 0

export function Settings(): JSX.Element { 
    useSelector((storeUpdate: ReduxStateType) => settingsService.getGenericSettings(storeUpdate))
    const [settings, setSettings] = useState(_.cloneDeep(settingsService.getGenericSettings(reduxState)))
    return (
        <div className="Settings-body">
            <p className="Settings-header">SETTINGS :</p>
            <SettingsButtons specificChannel={specificChannel} settings={settings}/>
            <hr/>
            {!specificChannel 
                ? <GeneralSettings settings={settings} setSettings={setSettings}/> 
                : <React.Fragment />}
            <Outputs specificChannel={specificChannel} settings={settings} setSettings={setSettings}/>
        </div>
    )
}
