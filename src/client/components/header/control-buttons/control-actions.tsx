import React from "react";
import { state } from "../../../../model/reducers/store";
import { socket } from "../../../util/socketClientHandlers";
import { useSelector } from "react-redux";
import settingsService from "../../../../model/services/settings-service";
import appNavigationService from "../../../../model/services/app-navigation-service";
import { State } from "../../../../model/reducers/index-reducer";
import Button from "../../shared/button";
import browserService from "../../../services/browser-service";
import { ClientToServer } from "../../../../model/socket-io-constants";
import './control-actions.scss'

export default function ControlActions(): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation))
  const mixState: boolean = useSelector(
      (state: State) => settingsService.getOutputSettings(state.settings, activeTab).mixState)
  const webState: boolean = useSelector(
      (state: State) => settingsService.getOutputSettings(state.settings, activeTab).webState)
  const loopState: boolean = useSelector(
      (state: State) => settingsService.getOutputSettings(state.settings, activeTab).loopState)
  const manualStartState: boolean = useSelector(
      (state: State) => settingsService.getOutputSettings(state.settings, activeTab).manualStartState)

  const buttonWrapperCss = "control-button-background"
  const buttonBaseCss = "control-button"
  return (
    <>
      {browserService.isOrdinaryView() && (
        <>
          <div className={buttonWrapperCss}>
            <Button
              className={`${buttonBaseCss} ${loopState ? 'on' : ''}`}
              onClick={() => emitSetLoopState(activeTab)}
              text="LOOP"
            />
          </div>
          <div className={buttonWrapperCss}>
            <Button
              className={`${buttonBaseCss} ${mixState ? 'on' : ''}`}
              onClick={() => emitSetMixState(activeTab)}
              text="MIX"
            />
          </div>
          <div className={buttonWrapperCss}>
            <Button
              className={`${buttonBaseCss} ${webState ? 'on' : ''}`}
              onClick={() => emitSetWebState(activeTab)}
              text="OVERLAY"
            />
          </div>                        
        </>
    )}

      <div className={buttonWrapperCss}>
        <Button
          className={`${buttonBaseCss} ${manualStartState ? 'on' : ''}`}
          onClick={() => emitSetManualStartState(activeTab)}
          text="MANUAL"
        />
        {manualStartState && <Button
          className="App-start-button"
          onClick={() => socket.emit(ClientToServer.PGM_PLAY, activeTab) }
          text="START"          
        />}        
      </div> 
    </>
  )
}

function emitSetLoopState(activeTab: number): void {
  socket.emit(
      ClientToServer.SET_LOOP_STATE,
      activeTab,
      !settingsService.getOutputSettings(state.settings, activeTab).loopState
  )
}

function emitSetMixState(activeTab: number): void {
  socket.emit(
      ClientToServer.SET_MIX_STATE,
      activeTab,
      !settingsService.getOutputSettings(state.settings, activeTab).mixState
  )
}

function emitSetWebState(activeTab: number): void {
  socket.emit(
      ClientToServer.SET_WEB_STATE,
      activeTab,
      !settingsService.getOutputSettings(state.settings, activeTab).webState
  )
}

function emitSetManualStartState(activeTab: number): void {
  socket.emit(
      ClientToServer.SET_MANUAL_START_STATE,
      activeTab,
      !settingsService.getOutputSettings(state.settings, activeTab).manualStartState
  )
}