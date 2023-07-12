import React from 'react'
import { useSelector } from 'react-redux'
import { EditVisibilityFooter } from '../edit-visibility-footer/edit-visibility-footer'
import { AppNavigationService } from '../../../../shared/services/app-navigation-service'
import { State } from '../../../../shared/reducers/index-reducer'
import { OperationMode } from '../../../../shared/models/settings-models'
import { ReduxSettingsService } from '../../../../shared/services/redux-settings-service'
import { BrowserService } from '../../../shared/services/browser-service'

export function OperationModeFooter(): JSX.Element {
  if (new BrowserService().isTextView()) {
    return (<></>)
  }
  const activeTabIndex: number = useSelector((state: State) => 
    new AppNavigationService().getActiveTabIndex(state.appNavigation)
  ) 
  const operationMode: OperationMode | undefined = useSelector((state: State) =>
    new ReduxSettingsService().getOutputSettings(state.settings, activeTabIndex)?.operationMode
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