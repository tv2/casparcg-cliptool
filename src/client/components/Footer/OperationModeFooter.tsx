import React from 'react'
import { useSelector } from 'react-redux'
import { OperationMode } from '../../../model/reducers/settingsReducer'
import { reduxState, ReduxStateType } from '../../../model/reducers/store'
import appNavigationService from '../../services/appNavigationService'
import mediaService from '../../services/mediaService'
import { OperationModeEditVisibilityFooter } from './OperationModeEditVisibilityFooter'

export function OperationModeFooter(): JSX.Element {
  const operationMode: OperationMode = useSelector((storeUpdate: ReduxStateType) =>
    storeUpdate.settings[0].generics.outputs[appNavigationService.getActiveTab()]?.operationMode)

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