import React from "react"
import { setActiveTab } from "../../../../model/reducers/app-navigation-action"
import { reduxStore } from "../../../../model/reducers/store"
import swipeService, { SwipeDirection } from "../../../services/swipe-service"
import Swipeable from "../../shared/swipeable"
import { Thumbnails } from "../../thumbnail/thumbnails/thumbnails"
import './tab.scss'

export interface TabProps {
  title: string
  activeTab: number
  tabIndex: number
  totalTabs: number
}

export default function Tab(props: TabProps): JSX.Element {
  return (
    <Swipeable className="tab" onSwipe={(direction) => onValidSwipe(direction, props.activeTab, props.totalTabs)} 
        role="tabpanel"> 
      <Thumbnails/> 
    </Swipeable>
  )
}

function onValidSwipe(direction: SwipeDirection, selectedTab: number, totalTabs: number): void {
  const nextTab = swipeService.getNextTab(selectedTab, direction)
  if (!swipeService.isValidTab(nextTab, totalTabs)) {
    return
  }
  reduxStore.dispatch(setActiveTab(nextTab))
}