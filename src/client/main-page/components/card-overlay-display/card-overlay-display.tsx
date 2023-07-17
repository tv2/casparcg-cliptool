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
  const reduxMediaService = new ReduxMediaService()
  const reduxSettingsService = new ReduxSettingsService()

  useSelector(
    (state: State) => reduxSettingsService
      .getOutputSettings(state.settings, props.activeTabIndex).selectedFileName
  )
  useSelector(
    (state: State) => reduxSettingsService
      .getOutputSettings(state.settings, props.activeTabIndex).cuedFileName
  )

  const time: [number, number] = useSelector(
    (state: State) => reduxMediaService.getOutput(state.media, props.activeTabIndex).time
  )
  
  const isSelected: boolean = reduxSettingsService.isThumbnailSelected(props.file.name, state.settings, props.activeTabIndex)
  const isCued: boolean = reduxSettingsService.isMediaCued(props.file.name, state.settings, props.activeTabIndex)
  const isValidFile: boolean = isSelected ? reduxMediaService.isValidFile(props.file, time) : false

  return (
  <div className="c-card-overlay-display">
      {(isSelected && isValidFile) && (
          <SelectedCardOverlay className={props.className ?? ''} fileType={props.file.type} timeRange={time}/>
      )}
      {isCued && (
          <CardOverlay showAs={CardOverlayType.CUED}>
            CUED     
          </CardOverlay>
      )}
  </div>  
  )
}