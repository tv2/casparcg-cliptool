import React from "react"
import { setActiveTab } from "../../../model/reducers/app-navigation-action"
import { TabData } from "../../../model/reducers/settingsModels"
import { reduxStore } from "../../../model/reducers/store"

import '../../css/Tab.css'

interface TabProps {
  tabData: TabData
  selectedTab: number
  index: number
  totalTabs: number
}

export function Tab(props: TabProps): JSX.Element {
  const isSelected = props.selectedTab === props.index
  return (
    <div 
      className={`tab ${isSelected ? 'active' : ''}`} 
      role='tab'
      aria-selected={isSelected} 
      key={props.index}
      onClick={() => setOutput(props.index, isSelected)
      }>
      {props.tabData.title}
    </div>
 )
}

function setOutput(tab: number, isSelected: boolean): void {
  if (!isSelected) {
    reduxStore.dispatch(setActiveTab(tab))
  }
}