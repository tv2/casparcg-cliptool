import React from "react"
import { useSelector } from "react-redux"
import { TabInfo } from "../../model/reducers/settings-models"
import browserService from "../services/browser-service"
import Tab from "./tab/tab/tab"
import Tabs from "./tab/tabs/tabs"
import { Thumbnails } from "./thumbnail/thumbnails/thumbnails"
import settingsService from "../../model/services/settings-service"
import { State } from "../../model/reducers/index-reducer"


export default function TabPanel(): JSX.Element {
  const tabs: TabInfo[] = useSelector((state: State) => settingsService.getTabInfo(state.settings, state.media))
  
  return browserService.isChannelView() 
    ? <Thumbnails/> 
    : <Tabs titles={tabs.map((info) => info.title)}>
        {tabs.map((data) => 
            <Tab key={data.index} />
        )}
    </Tabs>
}