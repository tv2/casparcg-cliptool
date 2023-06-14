import React from "react"
import { MediaOverview } from "../../media-card/media-overview/media-overview"
import './tab.scss'

export default function Tab(): JSX.Element {
  return (
    <div className="tab"> 
      <MediaOverview/> 
    </div>
  )
}