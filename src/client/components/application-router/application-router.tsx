import { useSelector } from "react-redux"
import { State } from "../../../model/reducers/index-reducer"
import React from "react"
import { Settings } from "../settings/settings/settings"
import Main from "../main"
import './application-router.scss'


export default function ApplicationRouter() {    
    const isConnected: boolean = useSelector(
        (state: State) => state.appNavigation.isConnected)
    const isSettingsVisible: boolean = useSelector((state: State) => state.appNavigation.isSettingsVisible)

    if (!isConnected) {
      return (<div className="offline-overlay">CONNECTING TO SERVER...</div>)
    }
    if (isSettingsVisible) {
      return (<Settings />)
    }
    return (<Main />)
}