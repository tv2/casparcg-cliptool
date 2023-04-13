import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../model/reducers/index-reducer";
import settingsService from "../../../model/services/settings-service";
import mediaService from "../../../model/services/media-service";
import { MediaFile } from "../../../model/reducers/media-models";
import { state } from "../../../model/reducers/store";
import SelectedThumbnailOverlay from "./selected-thumbnail-overlay";
import CuedThumbnailOverlay from "./cued-thumbnail-overlay";

interface ThumbnailOverlayDisplayProps {
  classNames?: string
  activeTab: number
  file: MediaFile
}

export default function ThumbnailOverlayDisplay(props: ThumbnailOverlayDisplayProps): JSX.Element {
  
  useSelector(
    (state: State) => settingsService
      .getOutputSettings(state.settings, props.activeTab).selectedFileName
  )
  useSelector(
    (state: State) => settingsService
      .getOutputSettings(state.settings, props.activeTab).cuedFileName
  )

  const time: [number, number] = useSelector(
    (state: State) => mediaService.getOutput(state.media, props.activeTab).time
  )
  
  const isSelected: boolean = settingsService.isThumbnailSelected(props.file.name, state.settings, props.activeTab)
  const isCued: boolean = settingsService.isThumbnailCued(props.file.name, state.settings, props.activeTab)
  let isValidFile: boolean = false
  if (isSelected) {
    isValidFile = mediaService.isValidFile(props.file, time)
  }

  return (
  <>
      {(isSelected && isValidFile) && (
          <SelectedThumbnailOverlay classNames={props.classNames ?? ''} fileType={props.file.type} time={time}/>
      )}
      {isCued && (
          <CuedThumbnailOverlay classNames={props.classNames ?? ''}/> 
      )}
  </>  
  )
}