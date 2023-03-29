import React from 'react'
import { useSelector } from 'react-redux'
import { ReduxStateType } from '../../../model/reducers/indexReducer'
import { OperationMode } from '../../../model/reducers/settingsModels'
import appNavigationService from '../../../model/services/app-navigation-service'
import settingsService from '../../../model/services/settings-service'
import { OperationModeEditVisibilityFooter } from './operationModeEditVisibilityFooter'

export function OperationModeFooter(): JSX.Element {
  const activeTab: number = useSelector(
    (storeUpdate: ReduxStateType) => appNavigationService.getActiveTab(storeUpdate.appNavigation))  
  const operationMode: OperationMode = useSelector((storeUpdate: ReduxStateType) =>
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