import React from "react"
import { setActiveTab } from "../../../model/reducers/appNavAction"
import { TabData } from "../../../model/reducers/settingsModels"
import { reduxStore } from "../../../model/reducers/store"

import '../../css/Tab.css'

interface TabProps {
  tabItem: TabData
  isSelected: boolean
  index: number
  totalTabs: number
}

function setOutput(tab: number) {
  reduxStore.dispatch(setActiveTab(tab))
}

export function Tab(props: TabProps): JSX.Element {
  const classNames = [ 
    'tab',               
    props.isSelected ? 'active' : ''
  ].join(' ')
 
  return (
    <div 
      className={classNames} 
      role='tab'
      aria-selected={props.isSelected} 
      key={props.index}
      onClick={() => {
        if (!props.isSelected)
          setOutput(props.index)
      }}>
      {props.tabItem.title}
    </div>
 )
}