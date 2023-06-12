import React from "react";
import { useSelector } from "react-redux";
import CardOverlay from "./card-overlay/card-overlay";
import appNavigationService from "../../../shared/services/app-navigation-service";
import { State } from "../../../shared/reducers/index-reducer";
import clientTimeService from "../../services/client-time-service";

interface SelectedCardOverlayProps {
  className?: string
  fileType: string
  time: [number, number]
}

export default function SelectedCardOverlay(props: SelectedCardOverlayProps): JSX.Element {
  const frameRate: number = useSelector(
      (state: State) => {
        const videoFormat = state.settings.ccgConfig.channels[appNavigationService.getActiveTabIndex(state.appNavigation)]?.videoFormat
        return videoFormat ? videoFormat.frameRate : 25
      }
    )

  const durationTimeCode = clientTimeService.convertDurationToTimeCode(props.time, frameRate, props.fileType)
  return (
    <CardOverlay className={`selected ${props.className ?? ''}`}>        
      {durationTimeCode}            
    </CardOverlay>
  )
  
}