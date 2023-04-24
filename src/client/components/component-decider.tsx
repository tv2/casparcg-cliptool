import { useSelector } from "react-redux"
import { State } from "../../model/reducers/index-reducer"
import OfflineOverlay from "./offline-overlay/offline-overlay"
import React from "react"
import { Settings } from "./settings/settings/settings"
import Main from "./main"

export default function ComponentDecider() {    
    const isConnected: boolean = useSelector(
        (state: State) => state.appNavigation.isConnected)
    const isSettingsOpen: boolean = useSelector((state: State) => state.appNavigation.isSettingsOpen)

    if (!isConnected) {
      return (<OfflineOverlay />)
    }
    if (isSettingsOpen) {
      return (<Settings />)
    }
    return (<Main />)
}