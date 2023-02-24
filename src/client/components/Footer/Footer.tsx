import React from 'react'
import { useSelector } from 'react-redux'
import { OperationMode } from '../../../model/reducers/mediaReducer'
import { reduxState } from '../../../model/reducers/store'
import * as IO from '../../../model/SocketIoConstants'

import '../../css/Footer.css'
import { socket } from '../../util/SocketClientHandlers'
import { EditVisibilityFooter } from './EditVisibilityFooter'

function resetOperationMode(): void {
  socket.emit(
    IO.SET_OPERATION_MODE, 
    reduxState.appNav[0].activeTab, 
    OperationMode.CONTROL
  )
}

function SwitchRender(props: {operationMode: OperationMode}): JSX.Element {
  switch (props.operationMode) {
    case OperationMode.EDIT_VISIBILITY: {
      return (        
          <EditVisibilityFooter onClick={resetOperationMode}/>
      )
    }
    case OperationMode.CONTROL:
    default: {
      return <></>
    }
  }
}

export function Footer(): JSX.Element {
  const operationMode: OperationMode = useSelector((storeUpdate: any) =>
    storeUpdate.media[0].output[reduxState.appNav[0].activeTab]?.operationMode)
  
  return (
    <footer className='Footer'>
      <SwitchRender operationMode={operationMode}/>
    </footer>
  )
}