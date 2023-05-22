import React from "react";
import { useSelector } from "react-redux";
import settingsService from "../../../../model/services/settings-service";
import appNavigationService from "../../../../model/services/app-navigation-service";
import { State } from "../../../../model/reducers/index-reducer";
import Button from "../../shared/button";
import browserService from "../../../services/browser-service";
import './control-actions.scss'
import socketService from "../../../services/socket-service";
import { OutputSettings } from "../../../../model/reducers/settings-models";
import ActionGroup from "../action-group/action-group";
import Toggle from "../../shared/switch/toggle";

export default function ControlActions(): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation))
  const outputSettings = useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, activeTab))

  return (
    <>
      {!browserService.isTextView() && (
        <>
          <ActionGroup>
            <Toggle
              checked={outputSettings.loopState}
              onChange={(isChecked) => toggleLoopState(activeTab, !isChecked)}>
                LOOP
            </Toggle>
          </ActionGroup>
          <ActionGroup>
            <Toggle
              checked={outputSettings.mixState}
              onChange={(isChecked) => toggleMixState(activeTab, !isChecked)}>
                MIX
            </Toggle>
          </ActionGroup>
          <ActionGroup>
            <Toggle
              checked={outputSettings.webState}
              onChange={(isChecked) => toggleWebState(activeTab, !isChecked)}>
                OVERLAY
             </Toggle>
          </ActionGroup>                        
        </>
    )}

      <ActionGroup classNames="control-action-last">
        <Toggle
          checked={outputSettings.manualStartState}
          onChange={(isChecked) => toggleManualStartState(activeTab, !isChecked)}>
            MANUAL
        </Toggle>
        {outputSettings.manualStartState && <Button
          classNames="control-action-start-button"
          onClick={() => playCuedFile(activeTab, outputSettings) }>
            START
        </Button>}        
      </ActionGroup> 
    </>
  )
}

function playCuedFile(activeTab: number, outputSettings: OutputSettings): void {
  if (!outputSettings.cuedFileName) {
    return
  }
  socketService.emitPlayFile(activeTab, outputSettings.cuedFileName)
}

function toggleLoopState(activeTab: number, isChecked: boolean): void {
  socketService.emitSetLoopState(activeTab, isChecked)
}

function toggleMixState(activeTab: number, isChecked: boolean): void {
  socketService.emitSetMixState(activeTab, isChecked)  
}

function toggleWebState(activeTab: number, isChecked: boolean): void {
  socketService.emitSetWebState(activeTab, isChecked)
}

function toggleManualStartState(activeTab: number, isChecked: boolean): void {
  socketService.emitSetManualStartState(activeTab, isChecked)
}