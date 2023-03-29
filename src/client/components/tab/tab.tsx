import React from "react"
import { setActiveTab } from "../../../model/reducers/app-navigation-action"
import { reduxStore } from "../../../model/reducers/store"
import swipeService, { SwipeDirection } from "../../services/swipeService"
import Swipeable from "../shared/swipeable"
import { Thumbnails } from "../thumbnail/thumbnails"

export interface TabProps {
  title: string
  selectedTab: number
  tabIndex: number
  totalTabs: number
}

const isSpecificChannel = new URLSearchParams(window.location.search).has('channel')

export default function Tab(props: TabProps): JSX.Element {
  return (
    <Swipeable onSwipe={(direction) => onValidSwipe(direction, props.selectedTab, props.totalTabs)} 
        allowSwipe={isSpecificChannel}
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