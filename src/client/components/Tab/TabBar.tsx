import React from 'react'
import { setActiveTab } from '../../../model/reducers/appNavAction'
import { ITabData } from '../../../model/reducers/settingsReducer'
import { reduxStore } from '../../../model/reducers/store'

import '../../css/Tab.css'

interface TabBarProps {
  tabData: ITabData[]
  selectedTab: number
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

function buildUnderlinedTabStyle(tabsCount: number, tabIndex: number): {width: string, left: string} {
  const width = 100 / tabsCount
  const leftPosition = width * tabIndex

  return {
    width: `${width}%`,
    left: `${leftPosition}%`
  }
}

export default function TabBar(props: TabBarProps): JSX.Element {
  return (
      <div className='tabs-bar animation' role={'tablist'}>
        {
          props.tabData.map((item, index) => {
            const isSelected = props.selectedTab === index
            const classNames = [ 
              'tab',               
              isSelected ? 'active' : ''
            ].join(' ')
            
            return (
              <div 
                className={classNames} 
                role={'tab'}
                aria-selected={isSelected} 
                style={buildTabStyle(props.tabData.length)} 
                key={index}
                onClick={() => {
                  if (!isSelected)
                    setOutput(index)
                }}>
                {item.title}
              </div>
            )
          })
        }
        <div 
          className='tab-active-underline animation' 
          style={buildUnderlinedTabStyle(props.tabData.length, props.selectedTab)}/>
      </div>
  )
}