import React from "react";
import { useSelector } from "react-redux"
import mediaService from "../../../../model/services/media-service";
import appNavigationService from "../../../../model/services/app-navigation-service";
import { State } from "../../../../model/reducers/index-reducer";
import { state } from "../../../../model/reducers/store";
import settingsService from "../../../../model/services/settings-service";
import _ from "lodash";
import './thumbnail-picture.scss'
import './../shared-thumbnail.scss'

interface ThumbnailPictureProps {
  fileName: string
}

export default function ThumbnailPicture(props: ThumbnailPictureProps): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation))

  const url: string = mediaService.getBase64ThumbnailUrl(props.fileName, activeTab || 0, state.media)
  const isSelected: boolean = settingsService.isThumbnailSelected(props.fileName, state.settings, activeTab)
  const isCued: boolean = settingsService.isThumbnailCued(props.fileName, state.settings, activeTab)

  const isSelectedClass = isSelected ? 'selected-thumbnail' : ''
  const chosenClass = isCued ? 'cued-thumbnail' : isSelectedClass
  return (
      <img src={url} className={`thumbnail-image ${chosenClass}`} />
  )
}