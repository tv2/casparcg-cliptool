import React from "react"
import { PGM_LOAD, PGM_PLAY, TOGGLE_THUMBNAIL_VISIBILITY } from "../../../model/socket-io-constants";
import { socket } from "../../util/socketClientHandlers";
import '../../css/Thumbnail.css'
import appNavigationService from "../../../model/services/app-navigation-service";
import settingsService from "../../../model/services/settings-service";
import { OperationMode } from "../../../model/reducers/settings-models";
import { MediaFile } from "../../../model/reducers/media-models";
import { reduxState } from "../../../model/reducers/store";
import { useSelector } from "react-redux";
import { State } from "../../../model/reducers/index-reducer";
import Button from "../shared/button";

interface ThumbnailButtonProps {
  file: MediaFile
  buttonClassName: string
}

export default function ThumbnailButton(props: ThumbnailButtonProps): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation))

  return (
    <Button
        className={props.buttonClassName}
        onClick={() => {
          triggerOperationModeAction(props.file.name, activeTab)
        }}
    />
  )
}

function triggerOperationModeAction(fileName: string, activeTab: number): void {    
  const operationMode = settingsService.getOutputSettings(reduxState.settings, activeTab)?.operationMode
  switch (operationMode) {
      case OperationMode.EDIT_VISIBILITY: 
          emitToggleVisibility(fileName)
          break;
      case OperationMode.CONTROL:
      default:
          emitPlayFile(fileName, activeTab)
          break
  }
}

function emitToggleVisibility(fileName: string): void {
  if (settingsService.isThumbnailSelectedOnAnyOutput(fileName, reduxState.settings)) {
      alert('Unable to hide, as the file is in use somewhere.')
      return
  }
      
  socket.emit(TOGGLE_THUMBNAIL_VISIBILITY, appNavigationService.getActiveTab(reduxState.appNavigation), fileName)
}

function emitPlayFile(fileName: string, activeTab: number ): void {
  const event = !settingsService.getOutputSettings(reduxState.settings, activeTab)?.manualStartState 
      ? PGM_PLAY 
      : PGM_LOAD
  socket.emit(event, appNavigationService.getActiveTab(reduxState.appNavigation), fileName)
}