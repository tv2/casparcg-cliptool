import React from "react"
import { useSelector } from "react-redux"
import browserService from "../services/browser-service"
import Tab from "./tab/tab/tab"
import Tabs from "./tab/tabs/tabs"
import { MediaOverview } from "./media-card/media-overview/media-overview"
import { State } from "../../shared/reducers/index-reducer"
import { TabInfo } from "../../shared/models/settings-models"
import settingsService from "../../shared/services/settings-service"


export default function TabPanel(): JSX.Element {
  const tabs: TabInfo[] = useSelector((state: State) => settingsService.getTabInfo(state.settings, state.media))
  
  return browserService.isChannelView() 
    ? <MediaOverview/> 
    : <Tabs titles={tabs.map((info) => info.title)}>
        {tabs.map((data) => 
            <Tab key={data.index} />
        )}
    </Tabs>
}