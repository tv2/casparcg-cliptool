import React from "react"
import { useSelector } from "react-redux"
import './timer-thumbnail.scss'
import Group from "../group/group";
import { State } from "../../../../shared/reducers/index-reducer";
import { AppNavigationService } from "../../../../shared/services/app-navigation-service";
import { FileType, Output } from "../../../../shared/models/media-models";
import { OutputSettings } from "../../../../shared/models/settings-models";
import { SettingsService } from "../../../../shared/services/settings-service";
import { state } from "../../../../shared/store";
import { MediaService } from "../../../../shared/services/media-service";
import { ClientTimeService } from "../../../services/client-time-service";

export default function TimerThumbnail(): JSX.Element {
    const activeTabIndex: number = useSelector(
        (state: State) => AppNavigationService.instance.getActiveTabIndex(state.appNavigation))
    const mediaOutput: Output = useSelector(
        (state: State) => MediaService.instance.getOutput(state.media, activeTabIndex))
    const settingsOutput: OutputSettings = useSelector(
        (state: State) => SettingsService.instance.getOutputSettings(state.settings, activeTabIndex))
    useSelector(
        (state: State) => SettingsService.instance.getOutputSettings(state.settings, activeTabIndex).selectedFileName)
    useSelector(
        (state: State) => SettingsService.instance.getOutputSettings(state.settings, activeTabIndex).cuedFileName)
    useSelector(
        (state: State) => MediaService.instance.getOutput(state.media, activeTabIndex)?.time[0])
    useSelector(
        (state: State) => MediaService.instance.getOutput(state.media, activeTabIndex)?.thumbnailList)

    const cleanFileName: string = SettingsService.instance.getCleanSelectedFileName(settingsOutput, state.settings) 
        || SettingsService.instance.getCleanCuedFileName(settingsOutput, state.settings)
    const thumbnailUrl: string = MediaService.instance.getBase64ThumbnailUrl(cleanFileName, activeTabIndex, state.media)
    const playingFileType: string = mediaOutput?.mediaFiles.find(file => file.name === cleanFileName)?.type ?? FileType.UNKNOWN

    const durationTimeCode = ClientTimeService.instance.convertDurationToTimeCode(
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