import React from "react"
import { setActiveTab } from "../../../model/reducers/appNavAction"
import { ITabData } from "../../../model/reducers/settingsReducer"
import { reduxStore } from "../../../model/reducers/store"

import '../../css/Tab.css'

interface TabProps {
  tabItem: ITabData
  isSelected: boolean
  index: number
  totalTabs: number
}

function setOutput(tab: number) {
  reduxStore.dispatch(setActiveTab(tab))
}

function buildTabStyle(tabsCount: number): {width: string} {
  const width = 100 / tabsCount
  
  return {
    width: `${width}%`
  }
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
      style={buildTabStyle(props.totalTabs)} 
      key={props.index}
      onClick={() => {
        if (!props.isSelected)
          setOutput(props.index)
      }}>
      {props.tabItem.title}
    </div>
 )
}