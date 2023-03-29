import React from "react";
import { useSelector } from "react-redux";
import mediaService from "../../../model/services/media-service";
import '../../css/Thumbnail.css'
import { MediaFile } from "../../../model/reducers/media-models";
import appNavigationService from "../../../model/services/app-navigation-service";
import { State } from "../../../model/reducers/index-reducer";
import settingsService from "../../../model/services/settings-service";
import { reduxState } from "../../../model/reducers/store";

interface TimeCodeProps {
  file: MediaFile
  isTextView?: boolean
}

export default function TimeCode(props: TimeCodeProps): JSX.Element {
  const activeTab: number = useSelector(
    (storeUpdate: State) => appNavigationService.getActiveTab(storeUpdate.appNavigation))
  const time: [number, number] = useSelector(
    (storeUpdate: State) => mediaService.getOutput(storeUpdate).time
  )
  const frameRate: number = useSelector(
      (storeUpdate: State) => {
        const videoFormat = storeUpdate.settings.ccgConfig.channels[appNavigationService.getActiveTab(reduxState.appNavigation)]?.videoFormat
        return videoFormat ? videoFormat.frameRate : 25
      }
  )

  const classNames: string = `thumbnail-timecode ${props.isTextView ? 'text' : ''}`

  return (
    <a className={classNames}>
        {settingsService.isThumbnailSelected(props.file.name, reduxState.settings, activeTab)
            ? mediaService.secondsToTimeCode(time, frameRate)
            : ''}
    </a>
  )
}