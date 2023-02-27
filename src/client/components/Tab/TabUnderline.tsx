import React from "react"
import '../../css/Underline.css'

interface TabUnderlineProps {
  selectedTab: number
  totalTabs: number
}

function buildUnderlinedTabStyle(tabsCount: number, tabIndex: number): {width: string, left: string} {
  const width = 100 / tabsCount
  const leftPosition = width * tabIndex

  return {
    width: `${width}%`,
    left: `${leftPosition}%`
  }
}

export function TabUnderline(props: TabUnderlineProps): JSX.Element {
  return (
    <div className="underline">
      <div 
        className="indicator" 
        style={buildUnderlinedTabStyle(props.totalTabs, props.selectedTab)} />
    </div>
  )
}