import React from "react"
import { useSelector } from "react-redux"
import { state } from "../../../../model/reducers/store";
import mediaService from "../../../../model/services/media-service";

import appNavigationService from "../../../../model/services/app-navigation-service";
import settingsService from "../../../../model/services/settings-service";
import timeService from "../../../../model/services/time-service";
import { FileType, Output } from "../../../../model/reducers/media-models";
import { OutputSettings } from "../../../../model/reducers/settings-models";
import { State } from "../../../../model/reducers/index-reducer";
import './timer.scss'
import ActionGroup from "../control-group/control-group";

export default function Timer(): JSX.Element {
    const activeTab: number = useSelector(
        (state: State) => appNavigationService.getActiveTab(state.appNavigation))
    const mediaOutput: Output = useSelector(
        (state: State) => mediaService.getOutput(state.media, activeTab))
    const settingsOutput: OutputSettings = useSelector(
        (state: State) => settingsService.getOutputSettings(state.settings, activeTab))
    useSelector(
        (state: State) => settingsService.getOutputSettings(state.settings, activeTab).selectedFileName)
    useSelector(
        (state: State) => mediaService.getOutput(state.media, activeTab)?.time[0])
    useSelector(
        (state: State) => mediaService.getOutput(state.media, activeTab)?.thumbnailList)

    let cleanFileName: string = settingsService.getCleanSelectedFileName(settingsOutput, state.settings)
    if (!cleanFileName) {
        cleanFileName = settingsService.getCleanCuedFileName(settingsOutput, state.settings)
    }
    const thumbnailUrl: string = mediaService.getBase64ThumbnailUrl(cleanFileName, activeTab, state.media)
    const playingFileType: string = mediaOutput?.mediaFiles.find(file => file.name === cleanFileName)?.type ?? FileType.UNKNOWN
    
    return (
        <ActionGroup>
            <label className="c-timer-timer">
                {timeService.durationToTimeCode(
                    mediaOutput ? mediaOutput.time : [0, 0],
                    state.settings.ccgConfig.channels[activeTab]?.videoFormat?.frameRate,
                    playingFileType
                )}
            </label>
            <img
                src={thumbnailUrl}
                className="c-timer-thumbnail"
            />
        </ActionGroup>
    )
}