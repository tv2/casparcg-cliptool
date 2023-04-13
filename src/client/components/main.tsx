import React from "react"
import { useSelector } from "react-redux"
import { State } from "../../model/reducers/index-reducer"
import { TabInfo } from "../../model/reducers/settings-models"
import appNavigationService from "../../model/services/app-navigation-service"
import browserService from "../services/browser-service"
import Tab from "./tab/tab/tab"
import Tabs from "./tab/tabs/tabs"
import { Thumbnails } from "./thumbnail/thumbnails/thumbnails"
import settingsService from "../../model/services/settings-service"


// TODO: possibly find a better name
export default function Main(): JSX.Element {
  const tabInfo: TabInfo[] = useSelector((state: State) => settingsService.getTabInfo(state.settings, state.media))
  const activeTab: number = useSelector((state: State) => appNavigationService.getActiveTab(state.appNavigation))
  
  return browserService.isChannelView() 
    ? <Thumbnails/> 
    : <Tabs >
        {tabInfo.map((data, index) => 
            <Tab title={data.title} 
                key={data.index} 
                activeTab={activeTab} 
                totalTabs={tabInfo.length} 
                tabIndex={index}/>
        )}
    </Tabs>
}