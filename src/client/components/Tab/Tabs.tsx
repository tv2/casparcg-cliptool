import React from 'react'
import { useSelector } from 'react-redux'

import TabBar from './TabBar'
import TabContent from './TabContent'

import '../../css/Tab.css'
import { ReduxStateType } from '../../../model/reducers/store'
import { TabData } from '../../../model/reducers/settingsModels'

export default function Tabs(): JSX.Element {
  const tabData: TabData[] = useSelector((storeUpdate: ReduxStateType) => storeUpdate.settings[0].tabData)
  const selectedTab: number = useSelector((storeUpdate: ReduxStateType) => storeUpdate.appNav[0].activeTab)

  return (
    <div className='tabs'>
      <TabBar tabData={tabData} selectedTab={selectedTab}/>
      <TabContent tabData={tabData} selectedTab={selectedTab} />      
    </div>
  )
}