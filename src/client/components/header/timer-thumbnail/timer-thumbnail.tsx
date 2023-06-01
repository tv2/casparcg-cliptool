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
import './timer-thumbnail.scss'
import Group from "../group/group";

export default function TimerThumbnail(): JSX.Element {
    const activeTabIndex: number = useSelector(
        (state: State) => appNavigationService.getActiveTabIndex(state.appNavigation))
    const mediaOutput: Output = useSelector(
        (state: State) => mediaService.getOutput(state.media, activeTabIndex))
    const settingsOutput: OutputSettings = useSelector(
        (state: State) => settingsService.getOutputSettings(state.settings, activeTabIndex))
    useSelector(
        (state: State) => settingsService.getOutputSettings(state.settings, activeTabIndex).selectedFileName)
    useSelector(
        (state: State) => settingsService.getOutputSettings(state.settings, activeTabIndex).cuedFileName)
    useSelector(
        (state: State) => mediaService.getOutput(state.media, activeTabIndex)?.time[0])
    useSelector(
        (state: State) => mediaService.getOutput(state.media, activeTabIndex)?.thumbnailList)

    const cleanFileName: string = settingsService.getCleanSelectedFileName(settingsOutput, state.settings) 
        || settingsService.getCleanCuedFileName(settingsOutput, state.settings)
    const thumbnailUrl: string = mediaService.getBase64ThumbnailUrl(cleanFileName, activeTabIndex, state.media)
    const playingFileType: string = mediaOutput?.mediaFiles.find(file => file.name === cleanFileName)?.type ?? FileType.UNKNOWN

    const durationTimeCode = timeService.durationToTimeCode(
        mediaOutput ? mediaOutput.time : [0, 0],
        state.settings.ccgConfig.channels[activeTabIndex]?.videoFormat?.frameRate,
        playingFileType
    )
    
    return (
        <Group>
            <label className="c-timer-thumbnail-timer">
                {durationTimeCode}
            </label>
            <img
                src={thumbnailUrl}
                className="c-timer-thumbnail-thumbnail"
            />
        </Group>
    )
}