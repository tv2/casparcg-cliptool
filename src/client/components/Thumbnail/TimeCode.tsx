import React from "react";
import { useSelector } from "react-redux";
import { MediaFile } from "../../../model/reducers/mediaReducer";
import mediaService from "../../../model/services/mediaService";

import '../../css/Thumbnail.css'
import { ReduxStateType } from "../../../model/reducers/store";
import appNavigationService from "../../../model/services/appNavigationService";

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
      (storeUpdate: ReduxStateType) => storeUpdate.settings[0].ccgConfig
          .channels[appNavigationService.getActiveTab()]?.videoFormat.frameRate
  )

  const classNames: string = [
    'thumbnail-timecode',
    props.isTextView ? 'text' : ''
  ].join(' ')

  return (
    <a className={classNames}>
        {mediaService.isThumbnailSelected(props.file.name)
            ? mediaService.secondsToTimeCode(time, frameRate)
            : ''}
    </a>
  )
}