import React from "react";
import { ReduxStateType, reduxStore } from "../../../model/reducers/store";
import { socket } from "../../util/socketClientHandlers";
import * as IO from '../../../model/socketIoConstants'
import { useSelector } from "react-redux";
import { TOGGLE_SHOW_SETTINGS } from "../../../model/reducers/appNavAction";
import '../../css/Settings.css'
import settingsService from "../../../model/services/settingsService";
import appNavigationService from "../../../model/services/appNavigationService";
import { GenericSettings, OperationMode } from "../../../model/reducers/settingsModels";
import _ from "lodash";

interface SettingsButtonsProps {
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
            onClick={() => handleDiscard(props.settings)}
        >
            {hasChanges(props.settings) ? 'DISCARD CHANGES' : 'CLOSE SETTINGS'}
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

function handleDiscard(settings: GenericSettings): void {
  if (hasChanges(settings)) {
    if (window.confirm('Changes have been made, are you sure you want to discard them?')) {
      toggleSettingsPage()
    }
  } else {
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

function handleSave(settings: GenericSettings): void {
  if (hasChanges(settings) && window.confirm('Changes have been made, do you want to save them?')) {
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

function hasChanges(settings: GenericSettings): boolean {
  const hasChanged = !_.isEqual(settings, settingsService.getGenericSettings())
  return hasChanged
}

