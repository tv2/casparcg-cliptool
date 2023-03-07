import React, { useState } from 'react'
import { setActiveTab } from '../../../model/reducers/appNavAction'
import { ITabData } from '../../../model/reducers/settingsReducer'
import { reduxState, reduxStore } from '../../../model/reducers/store'

import '../../css/Tab.css'
import { Thumbnail } from '../Thumbnail/Thumbnail'

const MIN_SWIPE_DISTANCE = 50

// Check if URL has a specific channel:
const channel = new URLSearchParams(window.location.search).get('channel')
const specificChannel = parseInt(channel) || 0

interface TabBarProps {
  tabData: ITabData[]
  selectedTab: number
}


export default function TabContent(props: TabBarProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    if (specificChannel) {
      return
    }
    setTouchEnd(null)
    setTouchStart(event.targetTouches[0].clientX)
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>){
    if (specificChannel) {
      return
    }
    setTouchEnd(event.targetTouches[0].clientX)
  }

  function handleTouchEnd() {
    if (!touchStart || !touchEnd || specificChannel){
      return
    }
    const activeTab = reduxState.appNav[0].activeTab
    const outputsCount = reduxState.media[0].output.length
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE 

    if (isRightSwipe && activeTab - 1 >= 0) {
      reduxStore.dispatch(setActiveTab(activeTab - 1))
    } else if (isLeftSwipe && activeTab + 1 < outputsCount) {
      reduxStore.dispatch(setActiveTab(activeTab + 1))
    }
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