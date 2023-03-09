import React from "react";
import { useSelector } from "react-redux"
import { IMediaFile } from "../../../model/reducers/mediaReducer"
import mediaService from "../../services/mediaService";
import '../../css/Thumbnail.css'

interface ThumbnailPictureProps {
  file: IMediaFile
}

export default function ThumbnailPicture(props: ThumbnailPictureProps): JSX.Element {
  // Redux hook:
  const file: IMediaFile = useSelector(
    (storeUpdate: any) => mediaService.getOutput(storeUpdate)
        .mediaFiles.find((predicate: IMediaFile) => predicate.name === props.file.name)
  )
  const url: string = mediaService.findThumbnail(file.name, mediaService.getActiveTab() || 0)
  const classNames: string = [
      'thumbnailImage',
      mediaService.isThumbnailWithTally(file.name) ? 'selected-thumb' : ''
  ].join(' ')

  return (
      <img src={url} className={classNames} />
  )
}