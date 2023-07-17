import React from "react";
import { useSelector } from "react-redux";
import CardOverlay, { CardOverlayType } from "../card-overlay/card-overlay";
import { AppNavigationService } from "../../../../shared/services/app-navigation-service";
import { State } from "../../../../shared/reducers/index-reducer";
import { ClientTimeService } from "../../../shared/services/client-time-service";

interface SelectedCardOverlayProps {
  className?: string
  fileType: string
  timeRange: [number, number]
}

export default function SelectedCardOverlay(props: SelectedCardOverlayProps): JSX.Element {
  const appNavigationService = new AppNavigationService() 
  const clientTimeService = new ClientTimeService()

  const activeTabIndex = useSelector((state: State) => appNavigationService.getActiveTabIndex(state.appNavigation))
  const frameRate: number = useSelector(
    (state: State) => {
      const videoFormat = state.settings.ccgConfig.channels[activeTabIndex]?.videoFormat
      return videoFormat ? videoFormat.frameRate : 25
    }
  )

  const durationTimeCode = clientTimeService.convertDurationToTimeCode(props.timeRange, frameRate, props.fileType)
  return (
    <CardOverlay showAs={CardOverlayType.SELECTED}>        
      {durationTimeCode}            
    </CardOverlay>
  )
  
}