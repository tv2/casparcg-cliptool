import React from "react";
import { useSelector } from "react-redux"
import mediaService from "../../../model/services/media-service";
import '../../css/Thumbnail.css'
import appNavigationService from "../../../model/services/app-navigation-service";
import { MediaFile } from "../../../model/reducers/media-models";
import { State } from "../../../model/reducers/index-reducer";
import { reduxState } from "../../../model/reducers/store";
import settingsService from "../../../model/services/settings-service";

interface ThumbnailPictureProps {
  file: MediaFile
}

export default function ThumbnailPicture(props: ThumbnailPictureProps): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation))
  const file: MediaFile | undefined = useSelector(
    (state: State) => mediaService.getOutput(state)
        .mediaFiles.find((predicate: MediaFile) => predicate.name === props.file.name)
  )
  if (!file) {
    return <></>
  }
  const url: string = mediaService.getBase64ThumbnailUrl(file.name, activeTab || 0)
  const classNames: string = `thumbnailImage ${settingsService.isThumbnailSelected(file.name, reduxState.settings, activeTab) ? 'selected-thumb' : ''}`

  return (
      <img src={url} className={classNames} />
  )
}