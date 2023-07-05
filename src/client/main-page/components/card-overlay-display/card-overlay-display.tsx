import React from "react";
import { useSelector } from "react-redux";
import SelectedCardOverlay from "../../../main-page/components/selected-card-overlay/selected-card-overlay";
import './card-overlay-display.scss'
import CardOverlay, { CardOverlayType } from "../card-overlay/card-overlay";
import { ReduxSettingsService } from "../../../../shared/services/redux-settings-service";
import { State } from "../../../../shared/reducers/index-reducer";
import { MediaFile } from "../../../../shared/models/media-models";
import { ReduxMediaService } from "../../../../shared/services/redux-media-service";
import { state } from "../../../../shared/store";

interface CardOverlayDisplayProps {
  className?: string
  activeTabIndex: number
  file: MediaFile
}

export default function CardOverlayDisplay(props: CardOverlayDisplayProps): JSX.Element {
  
  useSelector(
    (state: State) => new ReduxSettingsService()
      .getOutputSettings(state.settings, props.activeTabIndex).selectedFileName
  )
  useSelector(
    (state: State) => new ReduxSettingsService()
      .getOutputSettings(state.settings, props.activeTabIndex).cuedFileName
  )

  const time: [number, number] = useSelector(
    (state: State) => new ReduxMediaService().getOutput(state.media, props.activeTabIndex).time
  )
  
  const isSelected: boolean = new ReduxSettingsService().isThumbnailSelected(props.file.name, state.settings, props.activeTabIndex)
  const isCued: boolean = new ReduxSettingsService().isMediaCued(props.file.name, state.settings, props.activeTabIndex)
  const isValidFile: boolean = isSelected ? new ReduxMediaService().isValidFile(props.file, time) : false

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