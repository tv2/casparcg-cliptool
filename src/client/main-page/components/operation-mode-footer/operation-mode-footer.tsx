import React from 'react'
import { useSelector } from 'react-redux'
import { EditVisibilityFooter } from '../edit-visibility-footer/edit-visibility-footer'
import { AppNavigationService } from '../../../../shared/services/app-navigation-service'
import { State } from '../../../../shared/reducers/index-reducer'
import { OperationMode } from '../../../../shared/models/settings-models'
import { ReduxSettingsService } from '../../../../shared/services/redux-settings-service'
import { BrowserService } from '../../../shared/services/browser-service'

export function OperationModeFooter(): JSX.Element {
  const browserService = new BrowserService()
  const appNavigationService = new AppNavigationService()
  const reduxSettingsService = new ReduxSettingsService()

  if (browserService.isTextView()) {
    return (<></>)
  }
  const activeTabIndex: number = useSelector((state: State) => 
    appNavigationService.getActiveTabIndex(state.appNavigation)
  ) 
  const operationMode: OperationMode | undefined = useSelector((state: State) =>
    reduxSettingsService.getOutputSettings(state.settings, activeTabIndex)?.operationMode
  ) 
  switch (operationMode) {
    case OperationMode.EDIT_VISIBILITY: {
      return <EditVisibilityFooter />
    }
    case OperationMode.CONTROL:
    default: {
      return <></>
    }
  }
}