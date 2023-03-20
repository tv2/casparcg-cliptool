import React from "react";
import { reduxState, ReduxStateType } from "../../../model/reducers/store";
import { socket } from "../../util/socketClientHandlers";
import ToggleButton from "./toggleButton";
import * as IO from '../../../model/socketIoConstants'
import { useSelector } from "react-redux";
import settingsService from "../../../model/services/settingsService";

export default function HeaderButtons() {
  const activeTab: number = useSelector(
    (storeUpdate: ReduxStateType) => storeUpdate.appNav[0].activeTab)
  const mixState: boolean = useSelector(
      (storeUpdate: ReduxStateType) => storeUpdate.settings[0].generics.outputs[activeTab]?.mixState)
  const webState: boolean = useSelector(
      (storeUpdate: ReduxStateType) => storeUpdate.settings[0].generics.outputs[activeTab]?.webState)
  const loopState: boolean = useSelector(
      (storeUpdate: ReduxStateType) => storeUpdate.settings[0].generics.outputs[activeTab]?.loopState)
  const manualStartState: boolean = useSelector(
      (storeUpdate: ReduxStateType) => storeUpdate.settings[0].generics.outputs[activeTab]?.manualStartState)
  return (
    <>
      {reduxState.appNav[0].selectView === 0 ? (
        <>
            <ToggleButton 
                isToggled={loopState}
                onClick={() => handleLoopStatus(activeTab)}
                description='LOOP' />
            <ToggleButton 
                isToggled={mixState}
                onClick={() => handleMixStatus(activeTab)}
                description='MIX' />
            <ToggleButton 
                isToggled={webState}
                onClick={() => handleWebState(activeTab)}
                description='OVERLAY' />                            
        </>
    ) : (
        ''
    )}

    <ToggleButton 
        isToggled={manualStartState}
        onClick={() => handleManualStartStatus(activeTab)}
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

function handleLoopStatus(activeTab: number) {
  socket.emit(
      IO.SET_LOOP_STATE,
      activeTab,
      !settingsService.getOutputSettings(reduxState, activeTab).loopState
  )
}

function handleMixStatus(activeTab: number) {
  socket.emit(
      IO.SET_MIX_STATE,
      activeTab,
      !settingsService.getOutputSettings(reduxState, activeTab).mixState
  )
}

function handleWebState(activeTab: number) {
  socket.emit(
      IO.SET_WEB_STATE,
      activeTab,
      !settingsService.getOutputSettings(reduxState, activeTab).webState
  )
}

function handleManualStartStatus(activeTab: number) {
  socket.emit(
      IO.SET_MANUAL_START_STATE,
      activeTab,
      !settingsService.getOutputSettings(reduxState, activeTab).manualStartState
  )
}