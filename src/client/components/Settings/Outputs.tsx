import React from "react";
import { reduxState } from "../../../model/reducers/store";
import SingleOutput from "./SingleOutput";

// Check if URL has specifiet a channel:
const channel = new URLSearchParams(window.location.search).get('channel')
const specificChannel = parseInt(channel) || 0

export default function Outputs(): JSX.Element {
  return (
    <div>
        {specificChannel
            ? <SingleOutput index={specificChannel - 1}/>
            : reduxState.settings[0].ccgConfig.channels.map(
                  (item, index) => {
                      return <SingleOutput configChannel={item} index={index} key={index}/>
                  }
              )}
    </div>
)
}