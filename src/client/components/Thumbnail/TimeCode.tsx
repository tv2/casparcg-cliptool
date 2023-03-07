import React from "react";
import { useSelector } from "react-redux";
import { IMediaFile } from "../../../model/reducers/mediaReducer";
import MediaService from "../../services/mediaService";

import '../../css/Thumbnail.css'

interface TimeCodeProps {
  file: IMediaFile
  isTextView?: boolean
}

export default function TimeCode(props: TimeCodeProps): JSX.Element {
  // Redux hook:
  const time: [number, number] = useSelector(
    (storeUpdate: any) => MediaService.getOutput(storeUpdate).time
  )
  const frameRate: number = useSelector(
      (storeUpdate: any) => storeUpdate.settings[0].ccgConfig
          .channels[MediaService.getActiveTab()]?.videoFormat.frameRate
  )

  const classNames: string = [
    'thumbnail-timecode',
    props.isTextView ? 'text' : ''
  ].join(' ')

  return (
    <a className={classNames}>
        {MediaService.isThumbnailWithTally(props.file.name)
            ? MediaService.secondsToTimeCode(time, frameRate)
            : ''}
    </a>
  )
}