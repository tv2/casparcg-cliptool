import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../../model/reducers/index-reducer'
import { OperationMode } from '../../../model/reducers/settings-models'
import appNavigationService from '../../../model/services/app-navigation-service'
import settingsService from '../../../model/services/settings-service'
import { OperationModeEditVisibilityFooter } from './operation-mode-edit-visibility-footer/operation-mode-edit-visibility-footer'
import browserService from '../../services/browser-service'
import { state } from '../../../model/reducers/store'

export function OperationModeFooter(): JSX.Element {
  const activeTab: number = appNavigationService.getActiveTab(state.appNavigation)
  const operationMode: OperationMode = useSelector((state: State) =>
    settingsService.getOutputSettings(state.settings, activeTab)?.operationMode)
  
  if (browserService.isTextView()) {
    return (<></>)
  }
  switch (operationMode) {
    case OperationMode.EDIT_VISIBILITY: {
      return <OperationModeEditVisibilityFooter />
    }
    case OperationMode.CONTROL:
    default: {
      return <></>
    }
  }
}