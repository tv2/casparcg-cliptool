import React from 'react'
import { useSelector } from 'react-redux'
import { TabData } from '../../../model/reducers/settingsReducer'

import TabBar from './TabBar'
import TabContent from './TabContent'

import '../../css/Tab.css'

export default function Tabs(): JSX.Element {
  const tabData: TabData[] = useSelector((storeUpdate: any) => storeUpdate.settings[0].tabData)
  const selectedTab: number = useSelector((storeUpdate: any) => storeUpdate.appNav[0].activeTab)

  return (
    <div className='tabs'>
      <TabBar tabData={tabData} selectedTab={selectedTab}/>
      <TabContent tabData={tabData} selectedTab={selectedTab} />      
    </div>
  )
}