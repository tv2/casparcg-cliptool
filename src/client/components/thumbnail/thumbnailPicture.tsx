import React from "react";
import { useSelector } from "react-redux"
import mediaService from "../../../model/services/mediaService";
import '../../css/Thumbnail.css'
import appNavigationService from "../../../model/services/appNavigationService";
import { MediaFile } from "../../../model/reducers/mediaModels";
import { ReduxStateType } from "../../../model/reducers/indexReducer";
import { reduxState } from "../../../model/reducers/store";
import settingsService from "../../../model/services/settingsService";

interface ThumbnailPictureProps {
  file: MediaFile
}

export default function ThumbnailPicture(props: ThumbnailPictureProps): JSX.Element {
  const activeTab: number = useSelector(
    (storeUpdate: ReduxStateType) => appNavigationService.getActiveTab(storeUpdate.appNavigation))
  const file: MediaFile | undefined = useSelector(
    (storeUpdate: ReduxStateType) => mediaService.getOutput(storeUpdate)
        .mediaFiles.find((predicate: MediaFile) => predicate.name === props.file.name)
  )
  if (!file) {
    return <></>
  }
  const url: string = mediaService.findThumbnail(file.name, activeTab || 0)
  const classNames: string = `thumbnailImage ${settingsService.isThumbnailSelected(file.name, reduxState.settings, activeTab) ? 'selected-thumb' : ''}`

  return (
      <img src={url} className={classNames} />
  )
}