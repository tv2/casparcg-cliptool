import React from "react";
import { useSelector } from "react-redux"
import ThumbnailButton from "../thumbnail-button";
import SelectedThumbnailOverlay from "../selected-thumbnail-overlay";
import settingsService from "../../../../model/services/settings-service";
import { MediaFile } from "../../../../model/reducers/media-models";
import { State } from "../../../../model/reducers/index-reducer";
import appNavigationService from "../../../../model/services/app-navigation-service";
import { state } from "../../../../model/reducers/store";
import './text-thumbnail.scss'
import './../shared-thumbnail.scss'
import LoadedThumbnailOverlay from "../loaded-Thumbnail-overlay";

interface TextThumbnailProps {
  file: MediaFile
}

export default function TextThumbnail(props: TextThumbnailProps): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation))
  useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, activeTab)
      .selectedFile
  )
  useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, activeTab)
      .loadedFile
  )
  const isSelected: boolean = settingsService.isThumbnailSelected(props.file.name, state.settings, activeTab)
  const isLoaded: boolean = settingsService.isThumbnailLoaded(props.file.name, state.settings, activeTab)

  return (
    <div className={`thumbnail-text-view ${isLoaded ? 'loaded-thumbnail' : isSelected ? 'selected-thumbnail' : ''}`} >
        <ThumbnailButton fileName={props.file.name} className="thumbnail-text-view-ClickPgm" fileType={props.file.type}/>
        {isSelected && (
            <SelectedThumbnailOverlay classNames="text" fileType={props.file.type}/>
        )}
        {isLoaded && (
            <LoadedThumbnailOverlay classNames="text" /> 
        )}
        <p className="text-text-view">
            {props.file.name
                .substring(props.file.name.lastIndexOf('/') + 1)
                .slice(-45)}
        </p>
    </div>
  )
}