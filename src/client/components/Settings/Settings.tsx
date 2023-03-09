import React from 'react'
import '../../css/Settings.css'
import Outputs from './Outputs'
import SettingsButtons from './SettingsButtons'
import GeneralSettings from './GeneralSettings'
import { reduxState } from '../../../model/reducers/store'
import { GenericSettings } from '../../../model/reducers/settingsReducer'

// Check if URL has specifiet a channel:
const channel = new URLSearchParams(window.location.search).get('channel')
const specificChannel = parseInt(channel) || 0

export function SettingsPage(): JSX.Element { 
    const settings: GenericSettings = { ...reduxState.settings[0].generics }
    console.log(settings)
    return (
        <div className="Settings-body">
            <p className="Settings-header">SETTINGS :</p>
            <SettingsButtons specificChannel={specificChannel} settings={settings}/>
            <hr/>
            {!specificChannel ? <GeneralSettings /> : <React.Fragment />}
            <Outputs specificChannel={specificChannel} settings={settings}/>
        </div>
    )
}
