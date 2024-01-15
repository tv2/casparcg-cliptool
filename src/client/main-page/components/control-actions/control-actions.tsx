import React from "react";
import { useSelector } from "react-redux";
import { ReduxSettingsService } from "../../../../shared/services/redux-settings-service";
import { AppNavigationService } from "../../../../shared/services/app-navigation-service";
import { State } from "../../../../shared/reducers/index-reducer";
import './control-actions.scss'
import { OutputState } from "../../../../shared/models/settings-models";
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
  const outputState = useSelector(
    (state: State) => reduxSettingsService.getOutputState(state.settings, activeTabIndex)
  )

  return (
    <>
      {!isTextView && (
        <>
          <Group>
            <Toggle
              checked={outputState.loopState}
              onChange={(isChecked) => toggleLoopState(activeTabIndex, !isChecked)}>
                LOOP
            </Toggle>
          </Group>
          <Group>
            <Toggle
              checked={outputState.mixState}
              onChange={(isChecked) => toggleMixState(activeTabIndex, !isChecked)}>
                MIX
            </Toggle>
          </Group>
          <Group>
            <Toggle
              checked={outputState.webState}
              onChange={(isChecked) => toggleWebState(activeTabIndex, !isChecked)}>
                OVERLAY
             </Toggle>
          </Group>                        
        </>
    )}

      <Group className="control-action-last">
        <Toggle
          checked={outputState.manualStartState}
          onChange={(isChecked) => toggleManualStartState(activeTabIndex, !isChecked)}>
            MANUAL
        </Toggle>
        {outputState.manualStartState && <button
          className="control-action-start-button"
          onClick={() => playCuedFile(activeTabIndex, outputState) }>
            START
        </button>}        
      </Group> 
    </>
  )
}

function playCuedFile(activeTabIndex: number, outputState: OutputState): void {
  if (!outputState.cuedFileName) {
    return
  }
  new SocketPlayService(SocketService.instance.getSocket()).playFile(activeTabIndex, outputState.cuedFileName)
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