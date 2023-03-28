import React from "react";
import { reduxState } from "../../../model/reducers/store";
import { socket } from "../../util/socketClientHandlers";
import * as IO from '../../../model/socketIoConstants'
import { useSelector } from "react-redux";
import settingsService from "../../../model/services/settingsService";
import appNavigationService from "../../../model/services/appNavigationService";
import { ReduxStateType } from "../../../model/reducers/indexReducer";
import Button from "../shared/button";
import '../../css/Header.css'

// TODO: rename CSS class to more generic names - WITHOUT mentioning a location.
export default function ControlButtons(): JSX.Element {
  const activeTab: number = useSelector(
    (storeUpdate: ReduxStateType) => appNavigationService.getActiveTab(storeUpdate.appNavigation))
  const mixState: boolean = useSelector(
      (storeUpdate: ReduxStateType) => settingsService.getOutputSettings(storeUpdate.settings, activeTab)?.mixState)
  const webState: boolean = useSelector(
      (storeUpdate: ReduxStateType) => settingsService.getOutputSettings(storeUpdate.settings, activeTab)?.webState)
  const loopState: boolean = useSelector(
      (storeUpdate: ReduxStateType) => settingsService.getOutputSettings(storeUpdate.settings, activeTab)?.loopState)
  const manualStartState: boolean = useSelector(
      (storeUpdate: ReduxStateType) => settingsService.getOutputSettings(storeUpdate.settings, activeTab)?.manualStartState)

  const buttonWrapperCss = "header-button-background"
  const buttonBaseCss = "header-toggle-button"
  return (
    <>
      {reduxState.appNavigation.selectView === 0 && (
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
        <Button
          className="App-start-button"
          onClick={() => socket.emit(IO.PGM_PLAY, activeTab) }
          text="START"
          isHidden={!manualStartState}
        />        
      </div> 
    </>
  )
}

function emitSetLoopState(activeTab: number): void {
  socket.emit(
      IO.SET_LOOP_STATE,
      activeTab,
      !settingsService.getOutputSettings(reduxState.settings, activeTab).loopState
  )
}

function emitSetMixState(activeTab: number): void {
  socket.emit(
      IO.SET_MIX_STATE,
      activeTab,
      !settingsService.getOutputSettings(reduxState.settings, activeTab).mixState
  )
}

function emitSetWebState(activeTab: number): void {
  socket.emit(
      IO.SET_WEB_STATE,
      activeTab,
      !settingsService.getOutputSettings(reduxState.settings, activeTab).webState
  )
}

function emitSetManualStartState(activeTab: number): void {
  socket.emit(
      IO.SET_MANUAL_START_STATE,
      activeTab,
      !settingsService.getOutputSettings(reduxState.settings, activeTab).manualStartState
  )
}