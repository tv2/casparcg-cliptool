import React from "react"
import { useSelector } from "react-redux"
import { reduxState } from "../../../model/reducers/store";
import mediaService from "../../../model/services/media-service";

import '../../css/App-header.css'
import appNavigationService from "../../../model/services/app-navigation-service";
import settingsService from "../../../model/services/settings-service";
import { Output } from "../../../model/reducers/media-models";
import { OutputSettings } from "../../../model/reducers/settings-models";
import { State } from "../../../model/reducers/index-reducer";

export default function Time(): JSX.Element {
    const activeTab: number = useSelector(
        (storeUpdate: State) => appNavigationService.getActiveTab(storeUpdate.appNavigation))
    const mediaOutput: Output = useSelector(
        (storeUpdate: State) => mediaService.getOutput(storeUpdate))
    const settingsOutput: OutputSettings = useSelector(
        (storeUpdate: State) => settingsService.getOutputSettings(storeUpdate.settings, activeTab))
    useSelector(
        (storeUpdate: State) => settingsService.getOutputSettings(storeUpdate.settings, activeTab).selectedFile)
    useSelector(
        (storeUpdate: State) => mediaService.getOutput(storeUpdate)?.time[0])
    useSelector(
        (storeUpdate: State) => mediaService.getOutput(storeUpdate)?.thumbnailList)

    let cleanTallyFile: string = ''
    try {
        cleanTallyFile = settingsService.getCleanSelectedFile(settingsOutput, reduxState.settings)
    } catch {}
    const thumbnailUrl = mediaService.findThumbnail(cleanTallyFile, activeTab)
    
    return (
        <div className="App-timer-background">
            <button className="App-header-pgm-counter">
                {mediaService.secondsToTimeCode(
                    mediaOutput?.time,
                    reduxState.settings.ccgConfig.channels[activeTab]?.videoFormat?.frameRate
                )}
            </button>
            <img
                src={thumbnailUrl}
                className="App-header-pgm-thumbnail-image"
            />
        </div>
    )
}