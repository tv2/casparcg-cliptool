import React from "react";
import _ from "lodash";
import './settings-actions.scss'
import './../shared.scss'
import { ReduxSettingsService } from "../../../../shared/services/redux-settings-service";
import { GenericSettings, } from "../../../../shared/models/settings-models";
import { reduxStore, state } from "../../../../shared/store";
import { toggleSettingsVisibility } from "../../../../shared/actions/app-navigation-action";
import { BrowserService } from "../../../shared/services/browser-service";
import { SocketSettingsService } from "../../../shared/services/socket-settings-service";
import { SocketService } from "../../../shared/services/socket-service";
import { SocketOperationService } from "../../../shared/services/socket-operation-service";

interface SettingsActionsProps {
  settings: GenericSettings
}

export default function SettingsActions(props: SettingsActionsProps): JSX.Element {
  const hasChanges = settingsHasChanges(props.settings)
  return (
      <div className="settings-channel-form">
        <button className="c-settings-actions__button"
          onClick={() => saveSettings(hasChanges, props.settings)}>
            SAVE SETTINGS
        </button>
        <button className="c-settings-actions__button"
          onClick={() => closeSettings(hasChanges)}>
          {hasChanges ? 'DISCARD CHANGES & CLOSE SETTINGS' : 'CLOSE SETTINGS'} 
        </button>       
        
        {!new BrowserService().isChannelView() && (
          <button className="c-settings-actions__button"
            onClick={() => restartCliptool()}>
              RESTART CLIPTOOL
           </button>
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
