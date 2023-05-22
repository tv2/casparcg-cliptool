import { useSelector } from "react-redux"
import { State } from "../../../model/reducers/index-reducer"
import React from "react"
import { Settings } from "../settings/settings/settings"
import Main from "../main"
import './body.scss'


export default function Body() {    
    const isConnected: boolean = useSelector(
        (state: State) => state.appNavigation.isConnected)
    const isSettingsOpen: boolean = useSelector((state: State) => state.appNavigation.isSettingsOpen)

    if (!isConnected) {
      return (<div className="offline-overlay">CONNECTING TO SERVER...</div>)
    }
    if (isSettingsOpen) {
      return (<Settings />)
    }
    return (<Main />)
}