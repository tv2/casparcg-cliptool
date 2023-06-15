import React from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import Button from "../../shared/button";
import { BrowserService } from "../../../services/browser-service";
import './settings-actions.scss'
import './../shared-settings.scss'
import Toggle from "../../shared/switch/switch";
import { BackendOperationApi } from "../../../services/backend-operation-api";
import { AppNavigationService } from "../../../../shared/services/app-navigation-service";
import { State } from "../../../../shared/reducers/index-reducer";
import { SettingsService } from "../../../../shared/services/settings-service";
import { GenericSettings, OperationMode } from "../../../../shared/models/settings-models";
import { reduxStore, state } from "../../../../shared/store";
import { toggleSettingsVisibility } from "../../../../shared/actions/app-navigation-action";
import { BackendSettingsApi } from "../../../services/backend-settings-api";

interface SettingsActionsProps {
  settings: GenericSettings
}

export default function SettingsActions(props: SettingsActionsProps): JSX.Element {
  const activeTabIndex: number = useSelector(
    (state: State) => AppNavigationService.instance.getActiveTabIndex(state.appNavigation))
  const operationMode = useSelector(
    (state: State) => SettingsService.instance.getOutputSettings(state.settings, activeTabIndex)?.operationMode)
  
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
        
        {!BrowserService.instance.isChannelView() && (
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
    BackendSettingsApi.instance.emitSetGenericSettings(settings)
    toggleSettingsPage()
  }
}

function toggleSettingsPage(): void {
  reduxStore.dispatch(toggleSettingsVisibility())
}

function setOperationModeToEditVisibility(): void {
  const activeTabIndex: number = AppNavigationService.instance.getActiveTabIndex(state.appNavigation)
  const output = SettingsService.instance.getOutputSettings(state.settings, activeTabIndex)
  if (output.operationMode !== OperationMode.EDIT_VISIBILITY) {
      toggleSettingsPage()
      BackendOperationApi.instance.emitSetOperationModeToEditVisibility(activeTabIndex)
  }
  else {
    BackendOperationApi.instance.emitSetOperationModeToControl(activeTabIndex)
  }
}

function restartCliptool(): void {
  if (
      window.confirm(
          'Are you sure you want to restart Cliptool?'
      )
  ) {
      console.log('Restarting server...')
      BackendOperationApi.instance.emitRestartServer()
  }
}

function settingsHasChanges(settings: GenericSettings): boolean {
  return !_.isEqual(
      settings,
      SettingsService.instance.getGenericSettings(state.settings)
  )
}
