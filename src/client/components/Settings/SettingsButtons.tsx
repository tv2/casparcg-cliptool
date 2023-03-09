import React from "react";
import { OperationMode } from "../../../model/reducers/mediaReducer";
import { reduxState, reduxStore } from "../../../model/reducers/store";
import mediaService from "../../services/mediaService";
import { socket } from "../../util/SocketClientHandlers";
import * as IO from '../../../model/SocketIoConstants'
import { useSelector } from "react-redux";
import { TOGGLE_SHOW_SETTINGS } from "../../../model/reducers/appNavAction";
import '../../css/Settings.css'

interface SettingsButtonsProps {
  specificChannel: number
}

export default function SettingsButtons(props: SettingsButtonsProps): JSX.Element {
  const operationMode = useSelector(
    (storeUpdate: any) => mediaService.getOutput(storeUpdate)?.operationMode)
  
    const classNames = [ 
      'save-button',               
      operationMode === OperationMode.EDIT_VISIBILITY ? 'on' : ''
    ].join(' ')

  return (
      <div className="Settings-channel-form">
        <button
            className="save-button"
            onClick={handleSave}
        >
            SAVE SETTINGS
        </button>
        <button
            className="save-button"
            onClick={handleDiscard}
        >
            DISCARD CHANGES
        </button>
        <button
            className={classNames}
            onClick={handleEditVisibilityMode}
        >
            EDIT VISIBILITY
        </button>
        {!props.specificChannel ? (
            <button
                className="save-button"
                onClick={handleRestart}
            >
                RESTART CLIPTOOL
            </button>
        ) : (
            <React.Fragment />
        )}
    </div>
  )
}

function handleDiscard(): void {
  toggleSettingsPage()
}

function toggleSettingsPage(): void {
  reduxStore.dispatch({
      type: TOGGLE_SHOW_SETTINGS,
  })
}

function handleEditVisibilityMode(): void {
  const activeTab: number = mediaService.getActiveTab()
  const output = mediaService.getOutput(reduxState)
  if (output.operationMode !== OperationMode.EDIT_VISIBILITY) {
      toggleSettingsPage()
  }
  socket.emit(
      IO.SET_OPERATION_MODE, 
      activeTab, 
      output
          .operationMode !== OperationMode.EDIT_VISIBILITY 
          ? OperationMode.EDIT_VISIBILITY 
          : OperationMode.CONTROL
  )
}

function handleSave(): void {
  socket.emit(IO.SET_GENERICS, reduxState.settings[0].generics)
}

function handleRestart(): void {
  if (
      window.confirm(
          'Restarting server will stop all outputs, are you sure?'
      )
  ) {
      console.log('Restarting server...')
      socket.emit(IO.RESTART_SERVER)
  }
}

