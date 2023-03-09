import React from 'react'
import '../../css/Settings.css'
import Outputs from './Outputs'
import SettingsButtons from './SettingsButtons'
import GeneralSettings from './GeneralSettings'

// Check if URL has specifiet a channel:
const channel = new URLSearchParams(window.location.search).get('channel')
const specificChannel = parseInt(channel) || 0
export const SettingsPage = () => { 
    return (
        <div className="Settings-body">
            <p className="Settings-header">SETTINGS :</p>
            <SettingsButtons specificChannel={specificChannel}/>
            <hr/>
            {!specificChannel ? <GeneralSettings /> : <React.Fragment />}
            <Outputs specificChannel={specificChannel}/>
        </div>
    )
}
