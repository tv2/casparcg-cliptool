import React from "react"
import '../../css/Tab.css'

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
    <div 
      className='tab-active-underline animation' 
      style={buildUnderlinedTabStyle(props.totalTabs, props.selectedTab)}/>
  )
}