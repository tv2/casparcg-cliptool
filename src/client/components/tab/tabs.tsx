import React from 'react'
import { useSelector } from 'react-redux'

import TabBar from './tabBar'
import TabContent from './tabContent'

import '../../css/Tab.css'
import { TabData } from '../../../model/reducers/settingsModels'
import appNavigationService from '../../../model/services/appNavigationService'
import { ReduxStateType } from '../../../model/reducers/indexReducer'

export default function Tabs(): JSX.Element {
  const tabData: TabData[] = useSelector((storeUpdate: ReduxStateType) => storeUpdate.settings.tabData)
  const selectedTab: number = 
    useSelector((storeUpdate: ReduxStateType) => appNavigationService.getActiveTab(storeUpdate))

  return (
    <div className='tabs'>
      <TabBar tabData={tabData} selectedTab={selectedTab}/>
      <TabContent tabData={tabData} selectedTab={selectedTab} />      
    </div>
  )
}