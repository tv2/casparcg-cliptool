import { useSelector } from "react-redux"
import React from "react"
import MainPage from "../main-page"
import './application-router.scss'
import { State } from "../../../shared/reducers/index-reducer"
import { SettingsPage } from "../settings/settings-page/settings-page"


export default function ApplicationRouter() {    
    const isConnected: boolean = useSelector(
        (state: State) => state.appNavigation.isConnected)
    const isSettingsVisible: boolean = useSelector((state: State) => state.appNavigation.isSettingsVisible)

    if (!isConnected) {
      return (<div className="offline-overlay">CONNECTING TO SERVER...</div>)
    }
    if (isSettingsVisible) {
      return (<SettingsPage />)
    }
    return (<MainPage />)
}