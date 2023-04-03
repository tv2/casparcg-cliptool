import React from "react";
import { useSelector } from "react-redux";
import mediaService from "../../../../model/services/media-service";
import appNavigationService from "../../../../model/services/app-navigation-service";
import { State } from "../../../../model/reducers/index-reducer";
import timeService from "../../../../model/services/time-service";
import './time-code.scss'

interface TimeCodeProps {
  classNames?: string
}

export default function TimeCode(props: TimeCodeProps): JSX.Element {
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
    <a className={`thumbnail-timecode ${props.classNames ?? ''}`}>        
        {timeService.secondsToTimeCode(time, frameRate)}            
    </a>
  )
}