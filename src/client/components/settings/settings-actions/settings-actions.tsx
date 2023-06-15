import React from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import Button from "../../shared/button";
import browserService from "../../../services/browser-service";
import './settings-actions.scss'
import './../shared-settings.scss'
import Toggle from "../../shared/switch/switch";
import backendOperationApi from "../../../services/backend-operation-api";
import appNavigationService from "../../../../shared/services/app-navigation-service";
import { State } from "../../../../shared/reducers/index-reducer";
import settingsService from "../../../../shared/services/settings-service";
import { GenericSettings, OperationMode } from "../../../../shared/models/settings-models";
import { reduxStore, state } from "../../../../shared/store";
import { toggleSettingsVisibility } from "../../../../shared/actions/app-navigation-action";
import backendSettingApi from "../../../services/backend-settings-api";

interface SettingsActionsProps {
  settings: GenericSettings
}

export default function SettingsActions(props: SettingsActionsProps): JSX.Element {
  const activeTabIndex: number = useSelector(
    (state: State) => appNavigationService.getActiveTabIndex(state.appNavigation))
  const operationMode = useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, activeTabIndex)?.operationMode)
  
  const buttonCss = "c-settings-actions-button"
  const hasChanges = settingsHasChanges(props.settings)
  return (
      <div className="settings-channel-form">
        <Button className={buttonCss} 
          onClick={() => saveSettings(hasChanges, props.settings)}>
            SAVE SETTINGS
        </Button>
        <Button className={buttonCss}
          onClick={() => closeSettings(hasChanges)}>
          {hasChanges ? 'DISCARD CHANGES & CLOSE SETTINGS' : 'CLOSE SETTINGS'} 
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

function closeSettings(hasChanges: boolean): void {
  if (hasChanges && !window.confirm(
    'Changes have been made, are you sure you want to discard them?'
  )) {
    return
  }

  toggleSettingsPage()
}

function saveSettings(hasChanges: boolean, settings: GenericSettings): void {
  if (hasChanges && window.confirm(
    'Changes have been made, do you want to save them?'
  )) {
    backendSettingApi.emitSetGenericSettings(settings)
    toggleSettingsPage()
  }
}

function toggleSettingsPage(): void {
  reduxStore.dispatch(toggleSettingsVisibility())
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

function settingsHasChanges(settings: GenericSettings): boolean {
  return !_.isEqual(
      settings,
      settingsService.getGenericSettings(state.settings)
  )
}
