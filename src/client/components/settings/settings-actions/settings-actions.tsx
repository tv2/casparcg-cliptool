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
  const activeTabIndex: number = useSelector(
    (state: State) => appNavigationService.getActiveTabIndex(state.appNavigation))
  const operationMode = useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, activeTabIndex)?.operationMode)
  
  const buttonCss = "save-button"

  return (
      <div className="settings-channel-form">
        <Button className={buttonCss} 
          onClick={() => saveSettings()}>
            SAVE SETTINGS
        </Button>
        <Button className={buttonCss}
          onClick={() => discardSettings()}>
          {changingSettingsService.getHasChanges() ? 'DISCARD CHANGES' : 'CLOSE SETTINGS'} 
        </Button>
        <Toggle className={buttonCss} checked={operationMode === OperationMode.EDIT_VISIBILITY} 
          onChange={() => emitSetOperationModeToEditVisibility()}>
            EDIT VISIBILITY
        </Toggle>
        
        {!browserService.isChannelView() && (
          <Button className={buttonCss} 
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
  const activeTabIndex: number = appNavigationService.getActiveTabIndex(state.appNavigation)
  const output = settingsService.getOutputSettings(state.settings, activeTabIndex)
  if (output.operationMode !== OperationMode.EDIT_VISIBILITY) {
      toggleSettingsPage()
      socketService.emitSetOperationModeToEditVisibility(activeTabIndex)
  }
  else {
    socketService.emitSetOperationModeToControl(activeTabIndex)
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


