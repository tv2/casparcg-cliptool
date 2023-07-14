import React from "react";
import { useSelector } from "react-redux";
import { ReduxSettingsService } from "../../../../shared/services/redux-settings-service";
import { AppNavigationService } from "../../../../shared/services/app-navigation-service";
import { State } from "../../../../shared/reducers/index-reducer";
import './control-actions.scss'
import { OutputSettings } from "../../../../shared/models/settings-models";
import Group from "../../../shared/components/group/group";
import { BrowserService } from "../../../shared/services/browser-service";
import Toggle from "../../../shared/components/toggle/toggle";
import { SocketPlayService } from "../../../shared/services/socket-play-service";
import { SocketService } from "../../../shared/services/socket-service";
import { SocketSettingsService } from "../../../shared/services/socket-settings-service";

export default function ControlActions(): JSX.Element {
  const browserService = new BrowserService()
  const appNavigationService = new AppNavigationService()
  const reduxSettingsService = new ReduxSettingsService()

  const isTextView = browserService.isTextView() 
  const activeTabIndex: number = useSelector(
    (state: State) => appNavigationService.getActiveTabIndex(state.appNavigation)
  )
  const outputSettings = useSelector(
    (state: State) => reduxSettingsService.getOutputSettings(state.settings, activeTabIndex)
  )

  return (
    <>
      {!isTextView && (
        <>
          <Group>
            <Toggle
              checked={outputSettings.loopState}
              onChange={(isChecked) => toggleLoopState(activeTabIndex, !isChecked)}>
                LOOP
            </Toggle>
          </Group>
          <Group>
            <Toggle
              checked={outputSettings.mixState}
              onChange={(isChecked) => toggleMixState(activeTabIndex, !isChecked)}>
                MIX
            </Toggle>
          </Group>
          <Group>
            <Toggle
              checked={outputSettings.webState}
              onChange={(isChecked) => toggleWebState(activeTabIndex, !isChecked)}>
                OVERLAY
             </Toggle>
          </Group>                        
        </>
    )}

      <Group className="control-action-last">
        <Toggle
          checked={outputSettings.manualStartState}
          onChange={(isChecked) => toggleManualStartState(activeTabIndex, !isChecked)}>
            MANUAL
        </Toggle>
        {outputSettings.manualStartState && <button
          className="control-action-start-button"
          onClick={() => playCuedFile(activeTabIndex, outputSettings) }>
            START
        </button>}        
      </Group> 
    </>
  )
}

function playCuedFile(activeTabIndex: number, outputSettings: OutputSettings): void {
  if (!outputSettings.cuedFileName) {
    return
  }
  new SocketPlayService(SocketService.instance.getSocket()).playFile(activeTabIndex, outputSettings.cuedFileName)
}

function toggleLoopState(activeTabIndex: number, isChecked: boolean): void {
  new SocketSettingsService(SocketService.instance.getSocket()).setLoopState(activeTabIndex, isChecked)
}

function toggleMixState(activeTabIndex: number, isChecked: boolean): void {
  new SocketSettingsService(SocketService.instance.getSocket()).setMixState(activeTabIndex, isChecked)  
}

function toggleWebState(activeTabIndex: number, isChecked: boolean): void {
  new SocketSettingsService(SocketService.instance.getSocket()).setWebState(activeTabIndex, isChecked)
}

function toggleManualStartState(activeTabIndex: number, isChecked: boolean): void {
  new SocketSettingsService(SocketService.instance.getSocket()).setManualStartState(activeTabIndex, isChecked)
}