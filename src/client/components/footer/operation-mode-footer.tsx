import React from 'react'
import { useSelector } from 'react-redux'
import { EditVisibilityFooter } from './edit-visibility-footer/edit-visibility-footer'
import browserService from '../../services/browser-service'
import appNavigationService from '../../../shared/services/app-navigation-service'
import { State } from '../../../shared/reducers/index-reducer'
import { OperationMode } from '../../../shared/models/settings-models'
import settingsService from '../../../shared/services/settings-service'

export function OperationModeFooter(): JSX.Element {
  if (browserService.isTextView()) {
    return (<></>)
  }
  const activeTabIndex: number = useSelector((state: State) => 
    appNavigationService.getActiveTabIndex(state.appNavigation)) 
  const operationMode: OperationMode | undefined = useSelector((state: State) =>
    settingsService.getOutputSettings(state.settings, activeTabIndex)?.operationMode) 
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