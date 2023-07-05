import React from "react"
import './tab.scss'
import { MediaOverview } from "../media-overview/media-overview"

export default function Tab(): JSX.Element {
  return (
    <div className="tab"> 
      <MediaOverview/> 
    </div>
  )
}