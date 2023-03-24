import React from "react";
import { reduxState } from "../../../model/reducers/store";
import { socket } from "../../util/socketClientHandlers";
import ToggleButton from "./toggleButton";
import * as IO from '../../../model/socketIoConstants'
import { useSelector } from "react-redux";
import settingsService from "../../../model/services/settingsService";
import appNavigationService from "../../../model/services/appNavigationService";
import { ReduxStateType } from "../../../model/reducers/indexReducer";

export default function HeaderButtons(): JSX.Element {
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
  return (
    <>
      {reduxState.appNavigation.selectView === 0 && (
        <>
            <ToggleButton 
                isToggled={loopState}
                onClick={() => emitSetLoopState(activeTab)}
                description='LOOP' />
            <ToggleButton 
                isToggled={mixState}
                onClick={() => emitSetMixState(activeTab)}
                description='MIX' />
            <ToggleButton 
                isToggled={webState}
                onClick={() => emitSetWebState(activeTab)}
                description='OVERLAY' />                            
        </>
    )}

    <ToggleButton 
        isToggled={manualStartState}
        onClick={() => emitSetManualStartState(activeTab)}
        description='MANUAL'>
        <button
            hidden={ !manualStartState }
            className="App-start-button"
            onClick={() => socket.emit(IO.PGM_PLAY, activeTab) }
        >
            START
        </button>
    </ToggleButton>
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