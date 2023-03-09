import React from "react";
import { GenericSettings } from "../../../model/reducers/settingsReducer";
import { reduxState } from "../../../model/reducers/store";
import SingleOutput from "./SingleOutput";


interface OutputsProps {
    specificChannel: number
    settings: GenericSettings
}

export default function Outputs(props: OutputsProps): JSX.Element {
  return (
    <div>
        {props.specificChannel
            ? <SingleOutput index={props.specificChannel - 1} output={props.settings[props.specificChannel]}/>
            : reduxState.settings[0].ccgConfig.channels.map(
                  (item, index) => {
                      return <SingleOutput configChannel={item} index={index} output={props.settings[index]} key={index}/>
                  }
              )}
    </div>
)
}