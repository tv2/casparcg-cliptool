import React, { useState } from 'react'
import '../../css/Settings.css'
import Outputs from './outputs'
import SettingsButtons from './settingsButtons'
import GeneralSettings from './generalSettings'
import { reduxState, ReduxStateType } from '../../../model/reducers/store'
import { useSelector } from 'react-redux'
import _ from 'lodash'

// Check if URL has a specific channel:
const channel = new URLSearchParams(window.location.search).get('channel')
const specificChannel = parseInt(channel) || 0

export function Settings(): JSX.Element { 
    useSelector((storeUpdate: ReduxStateType) => storeUpdate.settings[0].generics)
    const [settings, setSettings] = useState(_.cloneDeep(reduxState.settings[0].generics))
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
