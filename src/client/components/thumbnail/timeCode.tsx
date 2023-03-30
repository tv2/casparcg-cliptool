import React from "react";
import { useSelector } from "react-redux";
import mediaService from "../../../model/services/media-service";
import '../../css/Thumbnail.css'
import { MediaFile } from "../../../model/reducers/media-models";
import appNavigationService from "../../../model/services/app-navigation-service";
import { State } from "../../../model/reducers/index-reducer";
import settingsService from "../../../model/services/settings-service";
import { reduxState } from "../../../model/reducers/store";
import timeService from "../../../model/services/time-service";


interface TimeCodeProps {
  file: MediaFile
  isTextView?: boolean
}

export default function TimeCode(props: TimeCodeProps): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation))
  const time: [number, number] = useSelector(
    (state: State) => mediaService.getOutput(state).time
  )
  const frameRate: number = useSelector(
      (state: State) => {
        const videoFormat = state.settings.ccgConfig.channels[appNavigationService.getActiveTab(reduxState.appNavigation)]?.videoFormat
        return videoFormat ? videoFormat.frameRate : 25
      }
  )

  const classNames: string = `thumbnail-timecode ${props.isTextView ? 'text' : ''}`

  return (
    <a className={classNames}>
        {settingsService.isThumbnailSelected(props.file.name, reduxState.settings, activeTab)
            ? timeService.secondsToTimeCode(time, frameRate)
            : ''}
    </a>
  )
}