import React from 'react'
import { TabData } from '../../../model/reducers/settingsModels'

import '../../css/Tab.css'
import { Tab } from './tab'

interface TabBarProps {
  tabData: TabData[]
  selectedTab: number
}

export default function TabBar(props: TabBarProps): JSX.Element {
  return (
      <div className='tabs-bar' role='tablist'>
        <div className="tabs-bar__tabs">
        {
          props.tabData.map((item, index) => {
            const isSelected = props.selectedTab === index    
            return (
              <Tab 
                index={index} 
                isSelected={isSelected} 
                key={index} 
                tabItem={item} 
                totalTabs={props.tabData.length}/>
            )
          })
        }
        </div>
      </div>
  )
}