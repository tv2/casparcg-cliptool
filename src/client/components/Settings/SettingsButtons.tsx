import React from "react";
import { reduxState, ReduxStateType, reduxStore } from "../../../model/reducers/store";
import mediaService from "../../services/mediaService";
import { socket } from "../../util/SocketClientHandlers";
import * as IO from '../../../model/SocketIoConstants'
import { useSelector } from "react-redux";
import { TOGGLE_SHOW_SETTINGS } from "../../../model/reducers/appNavAction";
import '../../css/Settings.css'
import { GenericSettings, OperationMode } from "../../../model/reducers/settingsReducer";
import settingsService from "../../services/settingsService";
import appNavigationService from "../../services/appNavigationService";

interface SettingsButtonsProps {
  // TODO: Figure out a proper type.
  settings: GenericSettings 
  specificChannel: number
}

export default function SettingsButtons(props: SettingsButtonsProps): JSX.Element {
  const operationMode = useSelector(
    (storeUpdate: ReduxStateType) => settingsService.getOutputSettings(storeUpdate)?.operationMode)
  
    const classNames = [ 
      'save-button',               
      operationMode === OperationMode.EDIT_VISIBILITY ? 'on' : ''
    ].join(' ')

  return (
      <div className="Settings-channel-form">
        <button
            className="save-button"
            onClick={() => handleSave(props.settings)}
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
   // TODO: improve logic to check if changes have actually been made.
  if (window.confirm('Changes have been made, are you sure you want to discard them?')) {
    toggleSettingsPage()
  }  
}

function toggleSettingsPage(): void {
  reduxStore.dispatch({
      type: TOGGLE_SHOW_SETTINGS,
  })
}

function handleEditVisibilityMode(): void {
  const activeTab: number = appNavigationService.getActiveTab()
  const output = settingsService.getOutputSettings()
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

function handleSave(settings: GenericSettings ): void {
  // TODO: improve logic to check if changes have actually been made.
  if (window.confirm('Changes have been made, do you want to save them?')) {
    socket.emit(IO.SET_GENERICS, settings)
    toggleSettingsPage()
  }  
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

