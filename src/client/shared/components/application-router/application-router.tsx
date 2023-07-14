import { useSelector } from "react-redux"
import React from "react"
import './application-router.scss'
import { State } from "../../../../shared/reducers/index-reducer"
import { SettingsPage } from "../../../settings-page/components/settings-page/settings-page"
import MainPage from "../../../main-page/components/main-page/main-page"


export default function ApplicationRouter() {    
    const isConnected: boolean = useSelector(
        (state: State) => state.appNavigation.isConnected
    )
    const isSettingsVisible: boolean = useSelector((state: State) => state.appNavigation.isSettingsVisible)

    if (!isConnected) {
      return (<div className="offline-overlay">CONNECTING TO SERVER...</div>)
    }
    if (isSettingsVisible) {
      return (<SettingsPage />)
    }
    return (<MainPage />)
}