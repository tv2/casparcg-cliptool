import React from "react"
import { useSelector } from "react-redux"
import { State } from "../../../../shared/reducers/index-reducer"
import { TabInfo } from "../../../../shared/models/settings-models"
import { ReduxSettingsService } from "../../../../shared/services/redux-settings-service"
import Header from "../media-control-header/media-control-header"
import { BrowserService } from "../../../shared/services/browser-service"
import { MediaOverview } from "../media-overview/media-overview"
import Tabs from "../tabs/tabs"
import { OperationModeFooter } from "../operation-mode-footer/operation-mode-footer"


export default function MainPage(): JSX.Element {
  const browserService = new BrowserService()
  const reduxSettingsService = new ReduxSettingsService()

  const isChannelView = browserService.isChannelView()
  const tabs: TabInfo[] = useSelector((state: State) => reduxSettingsService.getTabInfo(state.settings, state.media))
  
  return (
    <>
        <Header />
        {isChannelView 
            ? <MediaOverview/> 
            : <Tabs titles={tabs.map((info) => info.title)}>
                {tabs.map((data) => 
                  <div className="c-main-page__tab" key={data.index}> 
                    <MediaOverview/> 
                  </div>
                )}
            </Tabs>}
        <OperationModeFooter />
    </>
  )
}