import React from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import Button from "../../shared/button";
import browserService from "../../../services/browser-service";
import './settings-actions.scss'
import './../shared-settings.scss'
import changingSettingsService from "../../../services/changing-settings-service";
import Toggle from "../../shared/switch/switch";
import backendOperationApi from "../../../services/backend-operation-api";
import appNavigationService from "../../../../shared/services/app-navigation-service";
import { State } from "../../../../shared/reducers/index-reducer";
import settingsService from "../../../../shared/services/settings-service";
import { OperationMode } from "../../../../shared/models/settings-models";
import { state } from "../../../../shared/store";

export default function SettingsActions(): JSX.Element {
  const activeTabIndex: number = useSelector(
    (state: State) => appNavigationService.getActiveTabIndex(state.appNavigation))
  const operationMode = useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, activeTabIndex)?.operationMode)
  
  const buttonCss = "c-settings-actions-button"

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
          onChange={() => setOperationModeToEditVisibility()}>
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

function setOperationModeToEditVisibility(): void {
  const activeTabIndex: number = appNavigationService.getActiveTabIndex(state.appNavigation)
  const output = settingsService.getOutputSettings(state.settings, activeTabIndex)
  if (output.operationMode !== OperationMode.EDIT_VISIBILITY) {
      toggleSettingsPage()
      backendOperationApi.emitSetOperationModeToEditVisibility(activeTabIndex)
  }
  else {
    backendOperationApi.emitSetOperationModeToControl(activeTabIndex)
  }
}

function restartCliptool(): void {
  if (
      window.confirm(
          'Are you sure you want to restart Cliptool?'
      )
  ) {
      console.log('Restarting server...')
      backendOperationApi.emitRestartServer()
  }
}


