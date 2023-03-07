import React from "react";
import { reduxState } from "../../../model/reducers/store";
import { socket } from "../../util/SocketClientHandlers";
import ToggleButton from "./ToggleButton";
import * as IO from '../../../model/SocketIoConstants'
import { useSelector } from "react-redux";
import MediaService from "../../services/mediaService";

export default function HeaderButtons() {
  const activeTab: number = useSelector(
    (storeUpdate: any) => storeUpdate.appNav[0].activeTab)
  const mixState: boolean = useSelector(
      (storeUpdate: any) => storeUpdate.media[0].output[activeTab]?.mixState)
  const webState: boolean = useSelector(
      (storeUpdate: any) => storeUpdate.media[0].output[activeTab]?.webState)
  const loopState: boolean = useSelector(
      (storeUpdate: any) => storeUpdate.media[0].output[activeTab]?.loopState)
  const manualStartState: boolean = useSelector(
      (storeUpdate: any) => storeUpdate.media[0].output[activeTab]?.manualStartState)
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
      !MediaService.getOutput(reduxState, activeTab).loopState
  )
}

function handleMixStatus(activeTab: number) {
  socket.emit(
      IO.SET_MIX_STATE,
      activeTab,
      !MediaService.getOutput(reduxState, activeTab).mixState
  )
}

function handleWebState(activeTab: number) {
  socket.emit(
      IO.SET_WEB_STATE,
      activeTab,
      !MediaService.getOutput(reduxState, activeTab).webState
  )
}

function handleManualStartStatus(activeTab: number) {
  socket.emit(
      IO.SET_MANUAL_START_STATE,
      activeTab,
      !MediaService.getOutput(reduxState, activeTab).manualStartState
  )
}