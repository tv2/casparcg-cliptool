import React from "react";
import { state } from "../../../../model/reducers/store";
import { useSelector } from "react-redux";
import settingsService from "../../../../model/services/settings-service";
import appNavigationService from "../../../../model/services/app-navigation-service";
import { OperationMode } from "../../../../model/reducers/settings-models";
import _ from "lodash";
import { State } from "../../../../model/reducers/index-reducer";
import Button from "../../shared/button";
import browserService from "../../../services/browser-service";
import './settings-actions.scss'
import './../shared-settings.scss'
import changingSettingsService from "../../../services/changing-settings-service";
import socketService from "../../../services/socket-service";
import Toggle from "../../shared/switch/toggle";

export default function SettingsActions(): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation))
  const operationMode = useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, activeTab)?.operationMode)
  
  const buttonCss = "save-button"

  return (
      <div className="settings-channel-form">
        <Button classNames={buttonCss} 
          onClick={() => saveSettings()}>
            SAVE SETTINGS
        </Button>
        <Button classNames={buttonCss}
          onClick={() => discardSettings()}>
          {changingSettingsService.hasChanges() ? 'DISCARD CHANGES' : 'CLOSE SETTINGS'} 
        </Button>
        <Toggle classNames={buttonCss} checked={operationMode === OperationMode.EDIT_VISIBILITY} 
          onChange={() => emitSetOperationModeToEditVisibility()}>
            EDIT VISIBILITY
        </Toggle>
        
        {!browserService.isChannelView() && (
          <Button classNames={buttonCss} 
            onClick={() => restartCliptool()}>
              RESTART CLIPTOOL
           </Button>
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
      socketService.emitSetOperationModeToEditVisibility(activeTab)
  }
  else {
    socketService.emitSetOperationModeToControl(activeTab)
  }
}

function restartCliptool(): void {
  if (
      window.confirm(
          'Are you sure you want to restart Cliptool?'
      )
  ) {
      console.log('Restarting server...')
      socketService.emitRestartServer()
  }
}


