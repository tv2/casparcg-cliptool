import React from 'react'
import { ITabData } from '../../../model/reducers/settingsReducer'

import '../../css/Tab.css'
import { Thumbnail } from '../Thumbnail'

interface TabBarProps {
  tabData: ITabData[]
  selectedTab: number
}

export default function TabContent(props: TabBarProps) {
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
              <div className={classNames} role='tabpanel' key={index}>
                <Thumbnail/> 
              </div>
            )
        })
        }
      </div>
  )
}