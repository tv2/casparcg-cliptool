import React from 'react'
import { useSelector } from 'react-redux'
import { OperationMode } from '../../model/reducers/mediaReducer'
import { reduxState } from '../../model/reducers/store'

import '../css/Footer.css'

const footerDescriptions = new Map<OperationMode, string>([
  [OperationMode.EDIT_VISIBILITY, 'You are currently editing visibility of files.'],
])

export function Footer() {
  const operationMode: OperationMode = useSelector((storeUpdate: any) =>
    storeUpdate.media[0].output[reduxState.appNav[0].activeTab]?.operationMode)
  
  return (
    <footer className='Footer'>
      { operationMode !== OperationMode.CONTROL 
      ? <div className='Footer-text'>
        {footerDescriptions.has(operationMode) 
        ? footerDescriptions.get(operationMode).toUpperCase()
        : 'MISSING DESCRIPTION FOR SELECTED OPERATION MODE!'}
      </div> 
      : ''}
    </footer>
  )
}