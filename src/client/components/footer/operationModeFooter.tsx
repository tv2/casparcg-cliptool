import React from 'react'
import { useSelector } from 'react-redux'
import { OperationMode } from '../../../model/reducers/settingsModels'
import { ReduxStateType } from '../../../model/reducers/store'
import settingsService from '../../../model/services/settingsService'
import { OperationModeEditVisibilityFooter } from './operationModeEditVisibilityFooter'

export function OperationModeFooter(): JSX.Element {
  const operationMode: OperationMode = useSelector((storeUpdate: ReduxStateType) =>
    settingsService.getOutputSettings(storeUpdate)?.operationMode)

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