import React from "react";
import { useSelector } from "react-redux";
import mediaService from "../../../model/services/mediaService";

import '../../css/Thumbnail.css'
import { MediaFile } from "../../../model/reducers/mediaModels";
import appNavigationService from "../../../model/services/appNavigationService";
import { ReduxStateType } from "../../../model/reducers/indexReducer";

interface TimeCodeProps {
  file: MediaFile
  isTextView?: boolean
}

export default function TimeCode(props: TimeCodeProps): JSX.Element {
  // Redux hook:
  const time: [number, number] = useSelector(
    (storeUpdate: ReduxStateType) => mediaService.getOutput(storeUpdate).time
  )
  const frameRate: number = useSelector(
      (storeUpdate: ReduxStateType) => {
        const videoFormat = storeUpdate.settings.ccgConfig.channels[appNavigationService.getActiveTab()]?.videoFormat
        return videoFormat ? videoFormat.frameRate : 25
      }
  )

  const classNames: string = `thumbnail-timecode ${props.isTextView ? 'text' : ''}`

  return (
    <a className={classNames}>
        {mediaService.isThumbnailSelected(props.file.name)
            ? mediaService.secondsToTimeCode(time, frameRate)
            : ''}
    </a>
  )
}