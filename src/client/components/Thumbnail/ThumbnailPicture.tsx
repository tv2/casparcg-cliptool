import React from "react";
import { useSelector } from "react-redux"
import { MediaFile } from "../../../model/reducers/mediaReducer"
import mediaService from "../../../model/services/mediaService";
import '../../css/Thumbnail.css'
import { ReduxStateType } from "../../../model/reducers/store";
import appNavigationService from "../../../model/services/appNavigationService";

interface ThumbnailPictureProps {
  file: MediaFile
}

export default function ThumbnailPicture(props: ThumbnailPictureProps): JSX.Element {
  // Redux hook:
  const file: MediaFile = useSelector(
    (storeUpdate: ReduxStateType) => mediaService.getOutput(storeUpdate)
        .mediaFiles.find((predicate: MediaFile) => predicate.name === props.file.name)
  )
  const url: string = mediaService.findThumbnail(file.name, appNavigationService.getActiveTab() || 0)
  const classNames: string = [
      'thumbnailImage',
      mediaService.isThumbnailWithTally(file.name) ? 'selected-thumb' : ''
  ].join(' ')

  return (
      <img src={url} className={classNames} />
  )
}