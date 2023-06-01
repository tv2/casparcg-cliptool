import React from "react";
import { useSelector } from "react-redux"
import mediaService from "../../../../model/services/media-service";
import appNavigationService from "../../../../model/services/app-navigation-service";
import { State } from "../../../../model/reducers/index-reducer";
import { state } from "../../../../model/reducers/store";
import _ from "lodash";
import './thumbnail-picture.scss'

interface ThumbnailPictureProps {
  fileName: string
}

export default function ThumbnailPicture(props: ThumbnailPictureProps): JSX.Element {
  const activeTabIndex: number = useSelector(
    (state: State) => appNavigationService.getActiveTabIndex(state.appNavigation))

  const url: string = mediaService.getBase64ThumbnailUrl(props.fileName, activeTabIndex || 0, state.media)

  return (
      <img src={url} className="thumbnail-picture"/>
  )
}