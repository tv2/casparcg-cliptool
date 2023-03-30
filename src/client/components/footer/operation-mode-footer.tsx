import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../../../model/reducers/index-reducer'
import { OperationMode } from '../../../model/reducers/settings-models'
import appNavigationService from '../../../model/services/app-navigation-service'
import settingsService from '../../../model/services/settings-service'
import { OperationModeEditVisibilityFooter } from './operation-mode-edit-visibility-footer/operation-mode-edit-visibility-footer'

export function OperationModeFooter(): JSX.Element {
  const activeTab: number = useSelector(
    (storeUpdate: State) => appNavigationService.getActiveTab(storeUpdate.appNavigation))  
  const operationMode: OperationMode = useSelector((storeUpdate: State) =>
    settingsService.getOutputSettings(storeUpdate.settings, activeTab)?.operationMode)

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