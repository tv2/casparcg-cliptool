import React from "react";
import { reduxState } from "../../../model/reducers/store";
import SingleOutput from "./SingleOutput";


interface OutputsProps {
    specificChannel: number
}

export default function Outputs(props: OutputsProps): JSX.Element {
  return (
    <div>
        {props.specificChannel
            ? <SingleOutput index={props.specificChannel - 1}/>
            : reduxState.settings[0].ccgConfig.channels.map(
                  (item, index) => {
                      return <SingleOutput configChannel={item} index={index} key={index}/>
                  }
              )}
    </div>
)
}