import React, { useState } from 'react'
import '../../css/Settings.css'
import Outputs from './Outputs'
import SettingsButtons from './SettingsButtons'
import GeneralSettings from './GeneralSettings'
import { reduxState, ReduxStateType } from '../../../model/reducers/store'
import { GenericSettings } from '../../../model/reducers/settingsModels'
import { useSelector } from 'react-redux'
import { deepCopy } from 'deep-copy-ts'

// Check if URL has specifiet a channel:
const channel = new URLSearchParams(window.location.search).get('channel')
const specificChannel = parseInt(channel) || 0

export function Settings(): JSX.Element { 
    useSelector((storeUpdate: ReduxStateType) => storeUpdate.settings[0].generics)
    const settings: GenericSettings = deepCopy(reduxState.settings[0].generics)
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
