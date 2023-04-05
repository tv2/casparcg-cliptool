import React from "react";
import { state } from "../../../../model/reducers/store";
import { socket } from "../../../util/socketClientHandlers";
import { useSelector } from "react-redux";
import settingsService from "../../../../model/services/settings-service";
import appNavigationService from "../../../../model/services/app-navigation-service";
import { OperationMode } from "../../../../model/reducers/settings-models";
import _ from "lodash";
import { State } from "../../../../model/reducers/index-reducer";
import Button from "../../shared/button";
import browserService from "../../../services/browser-service";
import { ClientToServer } from "../../../../model/socket-io-constants";
import './settings-actions.scss'
import './../shared-settings.scss'
import changingSettingsService from "../../../services/changing-settings-service";

export default function SettingsActions(): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation))
  const operationMode = useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, activeTab)?.operationMode)
  
  const buttonCss = "save-button"

  return (
      <div className="settings-channel-form">
        <Button className={buttonCss} 
          onClick={() => saveSettings()} 
          text='SAVE SETTINGS'/>
        <Button className={buttonCss}
          onClick={() => discardSettings()} 
          text={changingSettingsService.hasChanges() ? 'DISCARD CHANGES' : 'CLOSE SETTINGS'}/>
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

function discardSettings(): void {
  changingSettingsService.discardSettings()
}

function saveSettings(): void {
  changingSettingsService.saveSettings()
}

function toggleSettingsPage(): void {
  changingSettingsService.toggleSettingsPage()
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


