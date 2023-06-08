import React from "react"
import { MediaOverview } from "../../thumbnail/media-overview/media-overview"
import './tab.scss'

export default function Tab(): JSX.Element {
  return (
    <div className="tab"> 
      <MediaOverview/> 
    </div>
  )
}