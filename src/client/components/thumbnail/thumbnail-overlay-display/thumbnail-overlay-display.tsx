import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../../model/reducers/index-reducer";
import settingsService from "../../../../model/services/settings-service";
import mediaService from "../../../../model/services/media-service";
import { MediaFile } from "../../../../model/reducers/media-models";
import { state } from "../../../../model/reducers/store";
import SelectedThumbnailOverlay from "../selected-thumbnail-overlay";
import './thumbnail-overlay-display.scss'
import ThumbnailOverlay from "../thumbnail-overlay/thumbnail-overlay";

interface ThumbnailOverlayDisplayProps {
  className?: string
  activeTabIndex: number
  file: MediaFile
}

export default function ThumbnailOverlayDisplay(props: ThumbnailOverlayDisplayProps): JSX.Element {
  
  useSelector(
    (state: State) => settingsService
      .getOutputSettings(state.settings, props.activeTabIndex).selectedFileName
  )
  useSelector(
    (state: State) => settingsService
      .getOutputSettings(state.settings, props.activeTabIndex).cuedFileName
  )

  const time: [number, number] = useSelector(
    (state: State) => mediaService.getOutput(state.media, props.activeTabIndex).time
  )
  
  const isSelected: boolean = settingsService.isThumbnailSelected(props.file.name, state.settings, props.activeTabIndex)
  const isCued: boolean = settingsService.isMediaCued(props.file.name, state.settings, props.activeTabIndex)
  let isValidFile: boolean = false
  if (isSelected) {
    isValidFile = mediaService.isValidFile(props.file, time)
  }

  return (
  <div className="c-thumbnail-overlay-display">
      {(isSelected && isValidFile) && (
          <SelectedThumbnailOverlay className={props.className ?? ''} fileType={props.file.type} time={time}/>
      )}
      {isCued && (
          <ThumbnailOverlay className={`cued ${props.className ?? ''}`}>
            CUED     
          </ThumbnailOverlay>
      )}
  </div>  
  )
}