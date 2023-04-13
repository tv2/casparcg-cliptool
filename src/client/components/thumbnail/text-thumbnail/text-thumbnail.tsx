import React from "react";
import { useSelector } from "react-redux"
import ThumbnailButton from "../thumbnail-button";
import settingsService from "../../../../model/services/settings-service";
import { MediaFile } from "../../../../model/reducers/media-models";
import { State } from "../../../../model/reducers/index-reducer";
import appNavigationService from "../../../../model/services/app-navigation-service";
import { state } from "../../../../model/reducers/store";
import './text-thumbnail.scss'
import './../shared-thumbnail.scss'
import ThumbnailOverlayDisplay from "../thumbnail-overlay-display";

interface TextThumbnailProps {
  file: MediaFile
}

export default function TextThumbnail(props: TextThumbnailProps): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation))
  useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, activeTab)
      .selectedFileName
  )
  useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, activeTab)
      .cuedFileName
  )
  const isSelected: boolean = settingsService.isThumbnailSelected(props.file.name, state.settings, activeTab)
  const isCued: boolean = settingsService.isThumbnailCued(props.file.name, state.settings, activeTab)

  return (
    <div className={`thumbnail-text-view ${isCued ? 'cued-thumbnail' : isSelected ? 'selected-thumbnail' : ''}`} >
        <ThumbnailButton fileName={props.file.name} className="thumbnail-text-view-ClickPgm" fileType={props.file.type}/>        
        <ThumbnailOverlayDisplay classNames="text-view" activeTab={activeTab} file={props.file} />        
        <p className="text-text-view">
            {props.file.name
                .substring(props.file.name.lastIndexOf('/') + 1)
                .slice(-45)}
        </p>
    </div>
  )
}