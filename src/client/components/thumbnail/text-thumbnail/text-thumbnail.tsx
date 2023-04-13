import React from "react";
import { useSelector } from "react-redux"
import ThumbnailButton from "../thumbnail-button";
import settingsService from "../../../../model/services/settings-service";
import { MediaFile } from "../../../../model/reducers/media-models";
import { State } from "../../../../model/reducers/index-reducer";
import { state } from "../../../../model/reducers/store";
import './text-thumbnail.scss'
import './../shared-thumbnail.scss'
import ThumbnailOverlayDisplay from "../thumbnail-overlay-display";

interface TextThumbnailProps {
  file: MediaFile
  activeTab: number
}

export default function TextThumbnail(props: TextThumbnailProps): JSX.Element {
  useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, props.activeTab)
      .selectedFileName
  )
  useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, props.activeTab)
      .cuedFileName
  )
  const isSelected: boolean = settingsService.isThumbnailSelected(props.file.name, state.settings, props.activeTab)
  const isCued: boolean = settingsService.isThumbnailCued(props.file.name, state.settings, props.activeTab)

  return (
    <div className={`thumbnail-text-view ${isCued ? 'cued-thumbnail' : isSelected ? 'selected-thumbnail' : ''}`} >
        <ThumbnailButton fileName={props.file.name} className="thumbnail-text-view-click-pgm" fileType={props.file.type} activeTab={props.activeTab}/>        
        <ThumbnailOverlayDisplay classNames="text-view" activeTab={props.activeTab} file={props.file} />        
        <p className="text-text-view">
            {props.file.name
                .substring(props.file.name.lastIndexOf('/') + 1)
                .slice(-45)}
        </p>
    </div>
  )
}