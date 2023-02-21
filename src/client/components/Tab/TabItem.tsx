import React from "react";
import { ITabData } from "../../../model/reducers/settingsReducer";
import { Thumbnail } from "../Thumbnail";

import '../../css/App.css'

interface TabItemProps {
  data?: ITabData
  index: number
}

export default function TabItem(props: TabItemProps): JSX.Element {
  return (
   <>
      <div className="App-intro" key={props.index}>
        <Thumbnail />
      </div>
    </>
  )
}