import { useSelector } from "react-redux"
import React from "react"
import { Settings } from "../settings/settings/settings"
import TabPanel from "../tab-panel"
import './application-router.scss'
import { State } from "../../../shared/reducers/index-reducer"


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
    return (<TabPanel />)
}