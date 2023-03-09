import React from 'react'
import { useSelector } from 'react-redux'
import { OperationMode } from '../../../model/reducers/mediaReducer'
import { reduxState } from '../../../model/reducers/store'
import { OperationModeEditVisibilityFooter } from './OperationModeEditVisibilityFooter'

export function OperationModeFooter(): JSX.Element {
  const operationMode: OperationMode = useSelector((storeUpdate: any) =>
  storeUpdate.media[0].output[reduxState.appNav[0].activeTab]?.operationMode)

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