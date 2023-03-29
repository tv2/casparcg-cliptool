import React, { useState } from 'react'
import { setActiveTab } from '../../../model/reducers/app-navigation-action'
import { TabData } from '../../../model/reducers/settingsModels'
import { reduxStore } from '../../../model/reducers/store'

import '../../css/Tab.css'
import swipeService, { Point, SwipeDirection } from '../../services/swipeService'
import Swipeable from '../shared/swipeable'
import { Thumbnails } from '../thumbnail/thumbnails'

const isSpecificChannel = new URLSearchParams(window.location.search).has('channel')

interface TabContentProps {
  tabData: TabData[]
  selectedTab: number
}

export default function TabContent(props: TabContentProps): JSX.Element {  
  return (
    <div className='tab-content-wrapper' >
        {
          props.tabData.map(({}, index) => {
            const isSelected = props.selectedTab === index
            
            // TODO: Find/Figure out a better value used for key.
            return (
              <Swipeable onSwipe={(direction) => onValidSwipe(direction, props)} 
                  shouldRender={isSelected} 
                  allowSwipe={isSpecificChannel}
                  role="tabpanel"
                  key={index}> 
                <Thumbnails/> 
              </Swipeable>
            )
        })
        }
      </div>
  ) 
}

function onValidSwipe(direction: SwipeDirection, props: TabContentProps) {
  const nextTab = swipeService.getNextTab(props.selectedTab, direction)
  if (!swipeService.isValidTab(nextTab, props.tabData.length)) {
    return
  }
  reduxStore.dispatch(setActiveTab(nextTab))
}