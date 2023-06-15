import React from 'react'
import { useSelector } from 'react-redux'
import { EditVisibilityFooter } from './edit-visibility-footer/edit-visibility-footer'
import { BrowserService } from '../../services/browser-service'
import { AppNavigationService } from '../../../shared/services/app-navigation-service'
import { State } from '../../../shared/reducers/index-reducer'
import { OperationMode } from '../../../shared/models/settings-models'
import { SettingsService } from '../../../shared/services/settings-service'

export function OperationModeFooter(): JSX.Element {
  if (BrowserService.instance.isTextView()) {
    return (<></>)
  }
  const activeTabIndex: number = useSelector((state: State) => 
    AppNavigationService.instance.getActiveTabIndex(state.appNavigation)) 
  const operationMode: OperationMode | undefined = useSelector((state: State) =>
    SettingsService.instance.getOutputSettings(state.settings, activeTabIndex)?.operationMode) 
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