import React, { useState } from 'react'
import { setActiveTab } from '../../../model/reducers/appNavAction'
import { TabData } from '../../../model/reducers/settingsModels'
import { reduxStore } from '../../../model/reducers/store'

import '../../css/Tab.css'
import swipeService, { Point } from '../../services/swipeService'
import { Thumbnail } from '../Thumbnail/Thumbnail'

const isSpecificChannel = new URLSearchParams(window.location.search).has('channel')

interface TabBarProps {
  tabData: TabData[]
  selectedTab: number
}

export default function TabContent(props: TabBarProps) {
  const [touchStart, setTouchStart] = useState<Point | null>(null)
  const [touchEnd, setTouchEnd] = useState<Point | null>(null)

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    if (isSpecificChannel) {
      return
    }
    setTouchEnd(null)
    setTouchStart(swipeService.getEventPoint(event))
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>){
    if (isSpecificChannel) {
      return
    }
    setTouchEnd(swipeService.getEventPoint(event))
  }

  function handleTouchEnd() {
    if (!touchStart || !touchEnd || isSpecificChannel){
      return
    }
    if (!swipeService.isValidSwipe(touchStart, touchEnd)) {
      return
    }
    const direction = swipeService.getSwipeDirection(touchStart, touchEnd)
    const nextTab = swipeService.getNextTab(props.selectedTab, direction)
    if (!swipeService.isValidTab(nextTab, props.tabData.length)) {
      return
    }
    reduxStore.dispatch(setActiveTab(nextTab))
  }

  return (
    <div className='tab-content-wrapper' >
        {
          props.tabData.map((item, index) => {
            const isSelected = props.selectedTab === index

            const classNames = [ 
              'tab-content',               
              !isSelected ? 'hidden' : ''
            ].join(' ')
            return (
              <div className={classNames} 
                role='tabpanel' 
                key={index} 
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}>
                <Thumbnail/> 
              </div>
            )
        })
        }
      </div>
  )
}