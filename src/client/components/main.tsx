import React from "react"
import { useSelector } from "react-redux"
import { ReduxStateType } from "../../model/reducers/indexReducer"
import { TabData } from "../../model/reducers/settingsModels"
import appNavigationService from "../../model/services/app-navigation-service"
import Tab from "./tab/tab"
import Tabs from "./tab/tabs"
import { Thumbnails } from "./thumbnail/thumbnails"

interface MainProps {
  specificChannel: number
}

// TODO: possibly find a better name
export default function Main(props: MainProps): JSX.Element {
  const tabData: TabData[] = useSelector((storeUpdate: ReduxStateType) => storeUpdate.settings.tabData)
  const selectedTab: number = useSelector((storeUpdate: ReduxStateType) => appNavigationService.getActiveTab(storeUpdate.appNavigation))
  
  return props.specificChannel 
    ? <Thumbnails/> 
    : <Tabs >
        {tabData.map((data, index) => 
            <Tab title={data.title} 
                key={data.key} 
                selectedTab={selectedTab} 
                totalTabs={tabData.length} 
                tabIndex={index}/>
        )}
    </Tabs>
}