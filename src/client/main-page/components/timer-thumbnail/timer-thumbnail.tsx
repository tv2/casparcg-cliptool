import React from "react"
import { useSelector } from "react-redux"
import './timer-thumbnail.scss'
import Group from "../../../shared/components/group/group";
import { State } from "../../../../shared/reducers/index-reducer";
import { AppNavigationService } from "../../../../shared/services/app-navigation-service";
import { FileType, Output } from "../../../../shared/models/media-models";
import { OutputSettings } from "../../../../shared/models/settings-models";
import { ReduxSettingsService } from "../../../../shared/services/redux-settings-service";
import { state } from "../../../../shared/store";
import { ReduxMediaService } from "../../../../shared/services/redux-media-service";
import { ClientTimeService } from "../../../shared/services/client-time-service";

export default function TimerThumbnail(): JSX.Element {
    const activeTabIndex: number = useSelector(
        (state: State) => new AppNavigationService().getActiveTabIndex(state.appNavigation)
    )
    const mediaOutput: Output = useSelector(
        (state: State) => new ReduxMediaService().getOutput(state.media, activeTabIndex)
    )
    const settingsOutput: OutputSettings = useSelector(
        (state: State) => new ReduxSettingsService().getOutputSettings(state.settings, activeTabIndex)
    )

    const cleanFileName: string = new ReduxSettingsService().getCleanSelectedFileName(settingsOutput, state.settings) 
        || new ReduxSettingsService().getCleanCuedFileName(settingsOutput, state.settings)
    const thumbnailUrl: string = new ReduxMediaService().getBase64ThumbnailUrl(cleanFileName, activeTabIndex, state.media)
    const playingFileType: string = mediaOutput?.mediaFiles.find(file => file.name === cleanFileName)?.type ?? FileType.UNKNOWN

    const durationTimeCode = new ClientTimeService().convertDurationToTimeCode(
        mediaOutput ? mediaOutput.time : [0, 0],
        state.settings.ccgConfig.channels[activeTabIndex]?.videoFormat?.frameRate,
        playingFileType
    )
    
    return (
        <Group>
            <label className="c-timer-thumbnail__timer">
                {durationTimeCode}
            </label>
            <img
                src={thumbnailUrl}
                className="c-timer-thumbnail__thumbnail"
            />
        </Group>
    )
}