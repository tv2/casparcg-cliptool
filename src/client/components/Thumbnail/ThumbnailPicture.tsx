import React from "react";
import { useSelector } from "react-redux"
import { IMediaFile } from "../../../model/reducers/mediaReducer"
import MediaService from "../../services/mediaService";
import '../../css/Thumbnail.css'

interface ThumbnailPictureProps {
  file: IMediaFile
}

export default function ThumbnailPicture(props: ThumbnailPictureProps): JSX.Element {
  // Redux hook:
  const file: IMediaFile = useSelector(
    (storeUpdate: any) => MediaService.getOutput(storeUpdate)
        .mediaFiles.find((predicate: IMediaFile) => predicate.name === props.file.name)
  )
  const url: string = MediaService.findThumbnail(file.name, MediaService.getActiveTab() || 0)
  const classNames: string = [
      'thumbnailImage',
      MediaService.isThumbnailWithTally(file.name) ? 'selected-thumb' : ''
  ].join(' ')

  return (
      <img src={url} className={classNames} />
  )
}