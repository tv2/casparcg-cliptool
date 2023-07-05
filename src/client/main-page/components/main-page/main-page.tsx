import React from "react"
import { useSelector } from "react-redux"
import Tab from "../tab/tab"
import { State } from "../../../../shared/reducers/index-reducer"
import { TabInfo } from "../../../../shared/models/settings-models"
import { ReduxSettingsService } from "../../../../shared/services/redux-settings-service"
import Header from "../header/header"
import { BrowserService } from "../../../shared/services/browser-service"
import { MediaOverview } from "../media-overview/media-overview"
import Tabs from "../tabs/tabs"
import { OperationModeFooter } from "../operation-mode-footer/operation-mode-footer"


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