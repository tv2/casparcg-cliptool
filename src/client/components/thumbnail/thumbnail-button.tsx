import React from "react"
import { socket } from "../../util/socketClientHandlers";
import appNavigationService from "../../../model/services/app-navigation-service";
import settingsService from "../../../model/services/settings-service";
import { OperationMode } from "../../../model/reducers/settings-models";
import { state } from "../../../model/reducers/store";
import { useSelector } from "react-redux";
import { State } from "../../../model/reducers/index-reducer";
import Button from "../shared/button";
import { ClientToServer } from "../../../model/socket-io-constants";
import browserService from "../../services/browser-service";

interface ThumbnailButtonProps {
  fileName: string
  className: string
}

export default function ThumbnailButton(props: ThumbnailButtonProps): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation))

  return (
    <Button
        className={props.className}
        onClick={() => {
          triggerOperationModeAction(props.fileName, activeTab)
        }}
    />
  )
}

function triggerOperationModeAction(fileName: string, activeTab: number): void {   
  if (browserService.isTextView()) {
    return emitPlayFile(fileName, activeTab)
  } 
  const operationMode = settingsService.getOutputSettings(state.settings, activeTab)?.operationMode
  switch (operationMode) {
      case OperationMode.EDIT_VISIBILITY: 
          emitToggleVisibility(fileName, activeTab)
          break;
      case OperationMode.CONTROL:
      default:
          emitPlayFile(fileName, activeTab)
          break
  }
}

function emitToggleVisibility(fileName: string, activeTab: number): void {
  if (settingsService.isThumbnailSelectedOnAnyOutput(fileName, state.settings)) {
      alert('Unable to hide, as the file is in use somewhere.')
      return
  }
      
  socket.emit(ClientToServer.TOGGLE_THUMBNAIL_VISIBILITY, activeTab, fileName)
}

function emitPlayFile(fileName: string, activeTab: number ): void {
  const event = !settingsService.getOutputSettings(state.settings, activeTab)?.manualStartState 
      ? ClientToServer.PGM_PLAY 
      : ClientToServer.PGM_LOAD
  socket.emit(event, activeTab, fileName)
}