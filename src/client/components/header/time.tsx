import React from "react"
import { useSelector } from "react-redux"
import { reduxState } from "../../../model/reducers/store";
import mediaService from "../../../model/services/mediaService";

import '../../css/App-header.css'
import appNavigationService from "../../../model/services/appNavigationService";
import settingsService from "../../../model/services/settingsService";
import { Output } from "../../../model/reducers/mediaModels";
import { OutputSettings } from "../../../model/reducers/settingsModels";
import { ReduxStateType } from "../../../model/reducers/indexReducer";

export default function Time(): JSX.Element {
    const activeTab: number = useSelector(
        () => appNavigationService.getActiveTab())
    const mediaOutput: Output = useSelector(
        (storeUpdate: ReduxStateType) => mediaService.getOutput(storeUpdate))
    const settingsOutput: OutputSettings = useSelector(
        (storeUpdate: ReduxStateType) => settingsService.getOutputSettings(storeUpdate))
    useSelector(
        (storeUpdate: ReduxStateType) => settingsService.getOutputSettings(storeUpdate).selectedFile)
    useSelector(
        (storeUpdate: ReduxStateType) => mediaService.getOutput(storeUpdate)?.time[0])
    useSelector(
        (storeUpdate: ReduxStateType) => mediaService.getOutput(storeUpdate)?.thumbnailList)

    let cleanTallyFile: string = ''
    try {
        cleanTallyFile = mediaService.getCleanSelectedFile(settingsOutput)
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