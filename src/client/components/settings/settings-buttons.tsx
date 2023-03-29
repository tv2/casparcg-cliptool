import React from "react";
import { reduxState, reduxStore } from "../../../model/reducers/store";
import { socket } from "../../util/socketClientHandlers";
import * as IO from '../../../model/socket-io-constants'
import { useSelector } from "react-redux";
import { TOGGLE_SHOW_SETTINGS } from "../../../model/reducers/app-navigation-action";
import '../../css/Settings.css'
import settingsService from "../../../model/services/settings-service";
import appNavigationService from "../../../model/services/app-navigation-service";
import { GenericSettings, OperationMode } from "../../../model/reducers/settings-models";
import _ from "lodash";
import { State } from "../../../model/reducers/index-reducer";
import Button from "../shared/button";

interface SettingsButtonsProps {
  settings: GenericSettings 
  specificChannel: number
}

export default function SettingsButtons(props: SettingsButtonsProps): JSX.Element {
  const activeTab: number = useSelector(
    (storeUpdate: State) => appNavigationService.getActiveTab(storeUpdate.appNavigation))
  const operationMode = useSelector(
    (storeUpdate: State) => settingsService.getOutputSettings(storeUpdate.settings, activeTab)?.operationMode)
  
  return (
      <div className="Settings-channel-form">
        <Button className="save-button" 
          onClick={() => saveSettings(props.settings)} 
          text='SAVE SETTINGS'/>
        <Button className="save-button" 
          onClick={() => discardSettings(props.settings)} 
          text={hasChanges(props.settings) ? 'DISCARD CHANGES' : 'CLOSE SETTINGS'}/>
        <Button className={`save-button ${operationMode === OperationMode.EDIT_VISIBILITY ? 'on' : ''}`} 
          onClick={() => emitSetOperationModeToEditVisibility()} 
          text="EDIT VISIBILITY"/>
        
        {!props.specificChannel && (
          <Button className="save-button" 
            onClick={() => restartCliptool()} 
            text="RESTART CLIPTOOL"/>
        )}
    </div>
  )
}

function discardSettings(settings: GenericSettings): void {
  if (hasChanges(settings) && !window.confirm('Changes have been made, are you sure you want to discard them?')) {    
    return    
  } 
  toggleSettingsPage()  
}

function toggleSettingsPage(): void {
  reduxStore.dispatch({
      type: TOGGLE_SHOW_SETTINGS,
  })
}

function emitSetOperationModeToEditVisibility(): void {
  const activeTab: number = appNavigationService.getActiveTab(reduxState.appNavigation)
  const output = settingsService.getOutputSettings(reduxState.settings, activeTab)
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

function saveSettings(settings: GenericSettings): void {
  if (hasChanges(settings) && window.confirm('Changes have been made, do you want to save them?')) {
    socket.emit(IO.SET_GENERICS, settings)
    toggleSettingsPage()
  } 
}

function restartCliptool(): void {
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
  const hasChanged = !_.isEqual(settings, settingsService.getGenericSettings(reduxState.settings))
  return hasChanged
}

