import React from "react";
import { useSelector } from "react-redux";
import mediaService from "../../../model/services/media-service";
import appNavigationService from "../../../model/services/app-navigation-service";
import { State } from "../../../model/reducers/index-reducer";
import timeService from "../../../model/services/time-service";
import ThumbnailOverlay from "./thumbnail-overlay/thumbnail-overlay";

interface SelectedThumbnailOverlayProps {
  classNames?: string
  fileType: string
}

export default function SelectedThumbnailOverlay(props: SelectedThumbnailOverlayProps): JSX.Element {
  const time: [number, number] = useSelector(
    (state: State) => mediaService.getOutput(state).time
  )
  const frameRate: number = useSelector(
      (state: State) => {
        const videoFormat = state.settings.ccgConfig.channels[appNavigationService.getActiveTab(state.appNavigation)]?.videoFormat
        return videoFormat ? videoFormat.frameRate : 25
      }
  )

  return (
    <ThumbnailOverlay classNames={`selected ${props.classNames ?? ''}`}>        
        {timeService.secondsToTimeCode(time, frameRate, props.fileType)}            
    </ThumbnailOverlay>
  )
}