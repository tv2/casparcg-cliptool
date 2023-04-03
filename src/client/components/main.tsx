import React from "react"
import { useSelector } from "react-redux"
import { State } from "../../model/reducers/index-reducer"
import { TabData } from "../../model/reducers/settings-models"
import appNavigationService from "../../model/services/app-navigation-service"
import browserService from "../services/browser-service"
import Tab from "./tab/tab"
import Tabs from "./tab/tabs/tabs"
import { Thumbnails } from "./thumbnail/thumbnails/thumbnails"


// TODO: possibly find a better name
export default function Main(): JSX.Element {
  const tabData: TabData[] = useSelector((state: State) => state.settings.tabData)
  const selectedTab: number = useSelector((state: State) => appNavigationService.getActiveTab(state.appNavigation))
  
  return browserService.isChannelView() 
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