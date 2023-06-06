import React from "react"
import { setActiveTabIndex } from "../../../../model/reducers/app-navigation-action"
import { reduxStore } from "../../../../model/reducers/store"
import './tab-title.scss'
import { useSelector } from "react-redux"
import { State } from "../../../../model/reducers/index-reducer"

interface TabTitleProps {
  title: string
  tabIndex: number
}

export default function TabTitle(props: TabTitleProps): JSX.Element {
  const activeTabIndex: number = useSelector((state: State) => state.appNavigation.activeTabIndex)
  const isSelected = activeTabIndex === props.tabIndex
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
    reduxStore.dispatch(setActiveTabIndex(tab))
  }
}
