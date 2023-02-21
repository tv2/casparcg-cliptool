import React from 'react'
import { useSelector } from 'react-redux'
import { OperationMode } from '../../model/reducers/mediaReducer'
import { reduxState } from '../../model/reducers/store'
import * as IO from '../../model/SocketIoConstants'

import '../css/Footer.css'
import { socket } from '../util/SocketClientHandlers'

const footerDescriptions = new Map<OperationMode, string>([
  [OperationMode.EDIT_VISIBILITY, 'You are currently editing visibility of files.'],
])

const exitButtonText = new Map<OperationMode, string>([
  [OperationMode.EDIT_VISIBILITY, 'Exit Edit Visibility']
])

function FooterContent(props: {operationMode: OperationMode}): JSX.Element {
  return (
    <>
      <div className='Footer-text'>
        {footerDescriptions.has(props.operationMode) 
        ? footerDescriptions.get(props.operationMode).toUpperCase()
        : 'MISSING DESCRIPTION FOR SELECTED OPERATION MODE!'}
      </div>        
      <button onClick={resetOperationMode} className='Footer-button'>
        {exitButtonText.has(props.operationMode) 
        ? exitButtonText.get(props.operationMode) 
        : 'MISSING BUTTON TEXT!'}
      </button>
    </>
  )
}

function resetOperationMode(): void {
  socket.emit(
    IO.SET_OPERATION_MODE, 
    reduxState.appNav[0].activeTab, 
    OperationMode.CONTROL
  )
}

export function Footer() {
  const operationMode: OperationMode = useSelector((storeUpdate: any) =>
    storeUpdate.media[0].output[reduxState.appNav[0].activeTab]?.operationMode)
  
  return (
    <footer className='Footer'>
      { operationMode && operationMode !== OperationMode.CONTROL 
      ? <div className='Footer-flex'>
          <FooterContent operationMode={operationMode}/>
      </div> 
      : ''}
    </footer>
  )
}