import React from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import Button from "../../shared/button";
import { BrowserService } from "../../../services/browser-service";
import './settings-actions.scss'
import './../shared-settings.scss'
import Toggle from "../../shared/switch/switch";
import { SocketOperationService } from "../../../services/socket-operation-service";
import { AppNavigationService } from "../../../../shared/services/app-navigation-service";
import { State } from "../../../../shared/reducers/index-reducer";
import { ReduxSettingsService } from "../../../../shared/services/redux-settings-service";
import { GenericSettings, OperationMode, OutputSettings } from "../../../../shared/models/settings-models";
import { reduxStore, state } from "../../../../shared/store";
import { toggleSettingsVisibility } from "../../../../shared/actions/app-navigation-action";
import { SocketSettingsService } from "../../../services/socket-settings-service";
import { SocketService } from "../../../services/socket-service";

interface SettingsActionsProps {
  settings: GenericSettings
  onChange: (changedOutput: OutputSettings[]) => void
}

export default function SettingsActions(props: SettingsActionsProps): JSX.Element {
  const activeTabIndex: number = useSelector(
    (state: State) => new AppNavigationService().getActiveTabIndex(state.appNavigation))
  const operationMode = useSelector(
    (state: State) => new ReduxSettingsService().getOutputSettings(state.settings, activeTabIndex)?.operationMode)
  
  function onOutputChanged(changedOutput: OutputSettings, outputIndex: number, operationMode: OperationMode): void {
    changedOutput.operationMode = operationMode
    props.settings.outputSettings[outputIndex] = changedOutput
    props.onChange(props.settings.outputSettings)
  }

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
          onChange={() => setOperationModeToEditVisibility(props.settings, onOutputChanged)}>
            EDIT VISIBILITY
        </Toggle>
        
        {!new BrowserService().isChannelView() && (
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
    new SocketSettingsService(SocketService.instance.getSocket()).setGenericSettings(settings)
    toggleSettingsPage()
  }
}

function toggleSettingsPage(): void {
  reduxStore.dispatch(toggleSettingsVisibility())
}

function setOperationModeToEditVisibility(settings: GenericSettings, onChange: (changedOutput: OutputSettings, outputIndex: number, operationMode: OperationMode) => void): void {
  const activeTabIndex: number = new AppNavigationService().getActiveTabIndex(state.appNavigation)
  const output = settings.outputSettings[activeTabIndex]
  if (output.operationMode !== OperationMode.EDIT_VISIBILITY) {
    new SocketOperationService(SocketService.instance.getSocket()).setOperationModeToEditVisibility(activeTabIndex)
      onChange(output, activeTabIndex, OperationMode.EDIT_VISIBILITY)
  }
  else {
    new SocketOperationService(SocketService.instance.getSocket()).setOperationModeToControl(activeTabIndex)
    onChange(output, activeTabIndex, OperationMode.CONTROL)
  }
}

function restartCliptool(): void {
  if (
      window.confirm(
          'Are you sure you want to restart Cliptool?'
      )
  ) {
      console.log('Restarting server...')
      new SocketOperationService(SocketService.instance.getSocket()).restartServer()
  }
}

function settingsHasChanges(settings: GenericSettings): boolean {
  return !_.isEqual(
      settings,
      new ReduxSettingsService().getGenericSettings(state.settings)
  )
}
