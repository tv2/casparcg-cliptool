import React from "react"
import { useSelector } from "react-redux"
import { BrowserService } from "../services/browser-service"
import Tab from "./tab/tab/tab"
import Tabs from "./tab/tabs/tabs"
import { MediaOverview } from "./media-card/media-overview/media-overview"
import { State } from "../../shared/reducers/index-reducer"
import { TabInfo } from "../../shared/models/settings-models"
import { ReduxSettingsService } from "../../shared/services/redux-settings-service"
import Header from "./header/header/header"
import { OperationModeFooter } from "./footer/operation-mode-footer"


export default function MainPage(): JSX.Element {
  const tabs: TabInfo[] = useSelector((state: State) => new ReduxSettingsService().getTabInfo(state.settings, state.media))
  
  return (
    <>
        <Header />
        {new BrowserService().isChannelView() 
            ? <MediaOverview/> 
            : <Tabs titles={tabs.map((info) => info.title)}>
                {tabs.map((data) => 
                    <Tab key={data.index} />
                )}
            </Tabs>}
        <OperationModeFooter />
    </>
  )
}