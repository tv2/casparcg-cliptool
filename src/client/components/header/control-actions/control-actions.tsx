import React from "react";
import { useSelector } from "react-redux";
import settingsService from "../../../../shared/services/settings-service";
import appNavigationService from "../../../../shared/services/app-navigation-service";
import { State } from "../../../../shared/reducers/index-reducer";
import Button from "../../shared/button";
import browserService from "../../../services/browser-service";
import './control-actions.scss'
import { OutputSettings } from "../../../../shared/models/settings-models";
import Group from "../group/group";
import Toggle from "../../shared/switch/switch";
import backendPlayApi from "../../../services/backend-play-api";
import backendSettingApi from "../../../services/backend-settings-api";

export default function ControlActions(): JSX.Element {
  const activeTabIndex: number = useSelector(
    (state: State) => appNavigationService.getActiveTabIndex(state.appNavigation))
  const outputSettings = useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, activeTabIndex))

  return (
    <>
      {!browserService.isTextView() && (
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
        {outputSettings.manualStartState && <Button
          className="control-action-start-button"
          onClick={() => playCuedFile(activeTabIndex, outputSettings) }>
            START
        </Button>}        
      </Group> 
    </>
  )
}

function playCuedFile(activeTabIndex: number, outputSettings: OutputSettings): void {
  if (!outputSettings.cuedFileName) {
    return
  }
  backendPlayApi.emitPlayFile(activeTabIndex, outputSettings.cuedFileName)
}

function toggleLoopState(activeTabIndex: number, isChecked: boolean): void {
  backendSettingApi.emitSetLoopState(activeTabIndex, isChecked)
}

function toggleMixState(activeTabIndex: number, isChecked: boolean): void {
  backendSettingApi.emitSetMixState(activeTabIndex, isChecked)  
}

function toggleWebState(activeTabIndex: number, isChecked: boolean): void {
  backendSettingApi.emitSetWebState(activeTabIndex, isChecked)
}

function toggleManualStartState(activeTabIndex: number, isChecked: boolean): void {
  backendSettingApi.emitSetManualStartState(activeTabIndex, isChecked)
}