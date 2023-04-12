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
import ControlGroup from "../control-group/control-group";

export default function ControlActions(): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation))
  const outputSettings = useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, activeTab))

  const buttonBaseCss = "control-button"
  return (
    <>
      {!browserService.isTextView() && (
        <>
          <ControlGroup>
            <Button
              className={`${buttonBaseCss} ${outputSettings.loopState ? 'on' : ''}`}
              onClick={() => toggleLoopState(activeTab, outputSettings)}
              text="LOOP"
            />
          </ControlGroup>
          <ControlGroup>
            <Button
              className={`${buttonBaseCss} ${outputSettings.mixState ? 'on' : ''}`}
              onClick={() => toggleMixState(activeTab, outputSettings)}
              text="MIX"
            />
          </ControlGroup>
          <ControlGroup>
            <Button
              className={`${buttonBaseCss} ${outputSettings.webState ? 'on' : ''}`}
              onClick={() => toggleWebState(activeTab, outputSettings)}
              text="OVERLAY"
            />
          </ControlGroup>                        
        </>
    )}

      <ControlGroup>
        <Button
          className={`${buttonBaseCss} ${outputSettings.manualStartState ? 'on' : ''}`}
          onClick={() => toggleManualStartState(activeTab, outputSettings)}
          text="MANUAL"
        />
        {outputSettings.manualStartState && <Button
          className="control-start-button"
          onClick={() => playLoadedFile(activeTab, outputSettings) }
          text="START"          
        />}        
      </ControlGroup> 
    </>
  )
}

function playLoadedFile(activeTab: number, outputSettings: OutputSettings) {
  if (!outputSettings.loadedFile) {
    return
  }
  socketService.emitPlayFile(activeTab, outputSettings.loadedFile)
}

function toggleLoopState(activeTab: number, outputSettings: OutputSettings): void {
  socketService.emitSetLoopState(activeTab, !outputSettings.loopState)
}

function toggleMixState(activeTab: number, outputSettings: OutputSettings): void {
  socketService.emitSetMixState(activeTab, !outputSettings.mixState)  
}

function toggleWebState(activeTab: number, outputSettings: OutputSettings): void {
  socketService.emitSetWebState(activeTab, !outputSettings.webState)
}

function toggleManualStartState(activeTab: number, outputSettings: OutputSettings): void {
  socketService.emitSetManualStartState(activeTab, !outputSettings.manualStartState)
}