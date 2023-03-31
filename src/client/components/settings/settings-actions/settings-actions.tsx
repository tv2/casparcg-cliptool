import React from "react";
import { state, reduxStore } from "../../../../model/reducers/store";
import { socket } from "../../../util/socketClientHandlers";
import { useSelector } from "react-redux";
import { TOGGLE_SHOW_SETTINGS } from "../../../../model/reducers/app-navigation-action";
import settingsService from "../../../../model/services/settings-service";
import appNavigationService from "../../../../model/services/app-navigation-service";
import { GenericSettings, OperationMode } from "../../../../model/reducers/settings-models";
import _ from "lodash";
import { State } from "../../../../model/reducers/index-reducer";
import Button from "../../shared/button";
import browserService from "../../../services/browser-service";
import { ClientToServer } from "../../../../model/socket-io-constants";
import './settings-actions.scss'
import './../shared-settings.scss'


interface SettingsButtonsProps {
  settings: GenericSettings 
}

export default function SettingsActions(props: SettingsButtonsProps): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation))
  const operationMode = useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, activeTab)?.operationMode)
  
  const buttonCss = "save-button"

  return (
      <div className="settings-channel-form">
        <Button className={buttonCss} 
          onClick={() => saveSettings(props.settings)} 
          text='SAVE SETTINGS'/>
        <Button className={buttonCss}
          onClick={() => discardSettings(props.settings)} 
          text={hasChanges(props.settings) ? 'DISCARD CHANGES' : 'CLOSE SETTINGS'}/>
        <Button className={`${buttonCss} ${operationMode === OperationMode.EDIT_VISIBILITY ? 'on' : ''}`} 
          onClick={() => emitSetOperationModeToEditVisibility()} 
          text="EDIT VISIBILITY"/>
        
        {!browserService.isChannelView() && (
          <Button className={buttonCss} 
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
  const activeTab: number = appNavigationService.getActiveTab(state.appNavigation)
  const output = settingsService.getOutputSettings(state.settings, activeTab)
  if (output.operationMode !== OperationMode.EDIT_VISIBILITY) {
      toggleSettingsPage()
  }
  socket.emit(
      ClientToServer.SET_OPERATION_MODE, 
      activeTab, 
      output
          .operationMode !== OperationMode.EDIT_VISIBILITY 
          ? OperationMode.EDIT_VISIBILITY 
          : OperationMode.CONTROL
  )
}

function saveSettings(settings: GenericSettings): void {
  if (hasChanges(settings) && window.confirm('Changes have been made, do you want to save them?')) {
    socket.emit(ClientToServer.SET_GENERICS, settings)
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
      socket.emit(ClientToServer.RESTART_SERVER)
  }
}

function hasChanges(settings: GenericSettings): boolean {
  return !_.isEqual(settings, settingsService.getGenericSettings(state.settings))
}

