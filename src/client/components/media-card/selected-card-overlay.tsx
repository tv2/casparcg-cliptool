import React from "react";
import { useSelector } from "react-redux";
import CardOverlay, { CardOverlayType } from "./card-overlay/card-overlay";
import { AppNavigationService } from "../../../shared/services/app-navigation-service";
import { State } from "../../../shared/reducers/index-reducer";
import { ClientTimeService } from "../../services/client-time-service";

interface SelectedCardOverlayProps {
  className?: string
  fileType: string
  time: [number, number]
}

export default function SelectedCardOverlay(props: SelectedCardOverlayProps): JSX.Element {
  const frameRate: number = useSelector(
      (state: State) => {
        const videoFormat = state.settings.ccgConfig.channels[AppNavigationService.instance.getActiveTabIndex(state.appNavigation)]?.videoFormat
        return videoFormat ? videoFormat.frameRate : 25
      }
    )

  const durationTimeCode = ClientTimeService.instance.convertDurationToTimeCode(props.time, frameRate, props.fileType)
  return (
    <CardOverlay showAs={CardOverlayType.SELECTED}>        
      {durationTimeCode}            
    </CardOverlay>
  )
  
}