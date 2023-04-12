import React from "react"
import { useSelector } from "react-redux"
import { state } from "../../../../model/reducers/store";
import mediaService from "../../../../model/services/media-service";

import appNavigationService from "../../../../model/services/app-navigation-service";
import settingsService from "../../../../model/services/settings-service";
import timeService from "../../../../model/services/time-service";
import { Output } from "../../../../model/reducers/media-models";
import { OutputSettings } from "../../../../model/reducers/settings-models";
import { State } from "../../../../model/reducers/index-reducer";
import './timer.scss'
import ControlGroup from "../control-group/control-group";

export default function Timer(): JSX.Element {
    const activeTab: number = useSelector(
        (state: State) => appNavigationService.getActiveTab(state.appNavigation))
    const mediaOutput: Output = useSelector(
        (state: State) => mediaService.getOutput(state))
    const settingsOutput: OutputSettings = useSelector(
        (state: State) => settingsService.getOutputSettings(state.settings, activeTab))
    useSelector(
        (state: State) => settingsService.getOutputSettings(state.settings, activeTab).selectedFile)
    useSelector(
        (state: State) => mediaService.getOutput(state)?.time[0])
    useSelector(
        (state: State) => mediaService.getOutput(state)?.thumbnailList)

    let cleanFileName: string = settingsService.getCleanSelectedFile(settingsOutput, state.settings)
    if (!cleanFileName) {
        cleanFileName = settingsService.getCleanLoadedFile(settingsOutput, state.settings)
    }
    const thumbnailUrl: string = mediaService.getBase64ThumbnailUrl(cleanFileName, activeTab, state)
    const playingFileType: string | undefined = mediaOutput?.mediaFiles.find(file => file.name === cleanFileName)?.type
    
    return (
        <ControlGroup>
            <label className="app-header-pgm-counter">
                {timeService.secondsToTimeCode(
                    mediaOutput?.time,
                    state.settings.ccgConfig.channels[activeTab]?.videoFormat?.frameRate,
                    playingFileType ?? 'UNKNOWN'
                )}
            </label>
            <img
                src={thumbnailUrl}
                className="app-header-pgm-thumbnail-image"
            />
        </ControlGroup>
    )
}