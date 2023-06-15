import React from "react";
import { useSelector } from "react-redux";
import SelectedCardOverlay from "../selected-card-overlay";
import './card-overlay-display.scss'
import CardOverlay, { CardOverlayType } from "../card-overlay/card-overlay";
import { SettingsService } from "../../../../shared/services/settings-service";
import { State } from "../../../../shared/reducers/index-reducer";
import { MediaFile } from "../../../../shared/models/media-models";
import { MediaService } from "../../../../shared/services/media-service";
import { state } from "../../../../shared/store";

interface CardOverlayDisplayProps {
  className?: string
  activeTabIndex: number
  file: MediaFile
}

export default function CardOverlayDisplay(props: CardOverlayDisplayProps): JSX.Element {
  
  useSelector(
    (state: State) => SettingsService.instance
      .getOutputSettings(state.settings, props.activeTabIndex).selectedFileName
  )
  useSelector(
    (state: State) => SettingsService.instance
      .getOutputSettings(state.settings, props.activeTabIndex).cuedFileName
  )

  const time: [number, number] = useSelector(
    (state: State) => MediaService.instance.getOutput(state.media, props.activeTabIndex).time
  )
  
  const isSelected: boolean = SettingsService.instance.isThumbnailSelected(props.file.name, state.settings, props.activeTabIndex)
  const isCued: boolean = SettingsService.instance.isMediaCued(props.file.name, state.settings, props.activeTabIndex)
  const isValidFile: boolean = isSelected ? MediaService.instance.isValidFile(props.file, time) : false

  return (
  <div className="c-card-overlay-display">
      {(isSelected && isValidFile) && (
          <SelectedCardOverlay className={props.className ?? ''} fileType={props.file.type} time={time}/>
      )}
      {isCued && (
          <CardOverlay showAs={CardOverlayType.CUED}>
            CUED     
          </CardOverlay>
      )}
  </div>  
  )
}