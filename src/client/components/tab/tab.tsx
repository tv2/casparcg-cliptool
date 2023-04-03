import React from "react"
import { setActiveTab } from "../../../model/reducers/app-navigation-action"
import { reduxStore } from "../../../model/reducers/store"
import swipeService, { SwipeDirection } from "../../services/swipe-service"
import Swipeable from "../shared/swipeable"
import { Thumbnails } from "../thumbnail/thumbnails/thumbnails"

export interface TabProps {
  title: string
  selectedTab: number
  tabIndex: number
  totalTabs: number
}

export default function Tab(props: TabProps): JSX.Element {
  // TODO: add CSS to have 'Swipeable' fill available height.
  return (
    <Swipeable onSwipe={(direction) => onValidSwipe(direction, props.selectedTab, props.totalTabs)} 
        role="tabpanel"> 
      <Thumbnails/> 
    </Swipeable>
  )
}

function onValidSwipe(direction: SwipeDirection, selectedTab: number, totalTabs: number) {
  const nextTab = swipeService.getNextTab(selectedTab, direction)
  if (!swipeService.isValidTab(nextTab, totalTabs)) {
    return
  }
  reduxStore.dispatch(setActiveTab(nextTab))
}