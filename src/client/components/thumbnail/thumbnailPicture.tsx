import React from "react";
import { useSelector } from "react-redux"
import mediaService from "../../../model/services/mediaService";
import '../../css/Thumbnail.css'
import appNavigationService from "../../../model/services/appNavigationService";
import { MediaFile } from "../../../model/reducers/mediaModels";
import { ReduxStateType } from "../../../model/reducers/indexReducer";

interface ThumbnailPictureProps {
  file: MediaFile
}

export default function ThumbnailPicture(props: ThumbnailPictureProps): JSX.Element {
  // Redux hook:
  const file: MediaFile | undefined = useSelector(
    (storeUpdate: ReduxStateType) => mediaService.getOutput(storeUpdate)
        .mediaFiles.find((predicate: MediaFile) => predicate.name === props.file.name)
  )
  if (!file) {
    return <></>
  }
  const url: string = mediaService.findThumbnail(file.name, appNavigationService.getActiveTab() || 0)
  const classNames: string = `thumbnailImage ${mediaService.isThumbnailSelected(file.name) ? 'selected-thumb' : ''}`

  return (
      <img src={url} className={classNames} />
  )
}