import React from "react"
import { setActiveTab } from "../../../../model/reducers/app-navigation-action"
import { reduxStore } from "../../../../model/reducers/store"
import './tab-title.scss'

interface TabTitleProps {
  title: string
  tabIndex: number
  selectedTab: number
}

export default function TabTitle(props: TabTitleProps): JSX.Element {
  const isSelected = props.selectedTab === props.tabIndex
  return (
    <div className={`tab-title ${isSelected ? 'active' : ''}`} 
      role='tab'
        aria-selected={isSelected} 
        key={props.tabIndex}
        onClick={() => setActiveOutput(props.tabIndex, isSelected)}
      >
      {props.title}
    </div> 
  )
}

function setActiveOutput(tab: number, isSelected: boolean): void {
  if (!isSelected) {
    reduxStore.dispatch(setActiveTab(tab))
  }
}
