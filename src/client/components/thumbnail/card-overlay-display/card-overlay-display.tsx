import React from "react";
import { useSelector } from "react-redux";
import SelectedCardOverlay from "../selected-thumbnail-overlay";
import './card-overlay-display.scss'
import CardOverlay from "../card-overlay/card-overlay";
import settingsService from "../../../../shared/services/settings-service";
import { State } from "../../../../shared/reducers/index-reducer";
import { MediaFile } from "../../../../shared/models/media-models";
import mediaService from "../../../../shared/services/media-service";
import { state } from "../../../../shared/store";

interface CardOverlayDisplayProps {
  className?: string
  activeTabIndex: number
  file: MediaFile
}

export default function CardOverlayDisplay(props: CardOverlayDisplayProps): JSX.Element {
  
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
  const isValidFile: boolean = isSelected ? mediaService.isValidFile(props.file, time) : false

  return (
  <div className="c-card-overlay-display">
      {(isSelected && isValidFile) && (
          <SelectedCardOverlay className={props.className ?? ''} fileType={props.file.type} time={time}/>
      )}
      {isCued && (
          <CardOverlay className={`cued ${props.className ?? ''}`}>
            CUED     
          </CardOverlay>
      )}
  </div>  
  )
}