import React from 'react'
import { ITabData } from '../../../model/reducers/settingsReducer'

import '../../css/Tab.css'
import TabItem from './TabItem'

interface TabBarProps {
  tabData: ITabData[]
  selectedTab: number
}

export default function TabContent(props: TabBarProps) {
  return (
    <div className='tab-content-wrapper animation' >
        {
          props.tabData.map((item, index) => {
            const isSelected = props.selectedTab === index

            const classNames = [ 
              'tab-content',               
              !isSelected ? 'hidden' : ''
            ].join(' ')
            return (
              <div className={classNames} role={'tabpanel'} key={index}>
                <TabItem data={item} index={index} key={index}/> 
              </div>
            )
        })
        }
      </div>
  )
}