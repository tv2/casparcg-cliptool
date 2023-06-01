import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../../model/reducers/index-reducer'
import { OperationMode } from '../../../model/reducers/settings-models'
import appNavigationService from '../../../model/services/app-navigation-service'
import settingsService from '../../../model/services/settings-service'
import { EditVisibilityFooter } from './edit-visibility-footer/edit-visibility-footer'
import browserService from '../../services/browser-service'

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