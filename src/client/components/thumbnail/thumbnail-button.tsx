import React from "react"
import appNavigationService from "../../../model/services/app-navigation-service";
import settingsService from "../../../model/services/settings-service";
import { OperationMode, OutputSettings } from "../../../model/reducers/settings-models";
import { state } from "../../../model/reducers/store";
import { useSelector } from "react-redux";
import { State } from "../../../model/reducers/index-reducer";
import Button from "../shared/button";
import browserService from "../../services/browser-service";
import socketService from "../../services/socket-service";
import { FileType } from "../../../model/reducers/media-models";

interface ThumbnailButtonProps {
  fileName: string
  fileType: string
  className: string
}

export default function ThumbnailButton(props: ThumbnailButtonProps): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation))

  return (
    <Button
        className={props.className}
        onClick={() => {
          triggerOperationModeAction(props.fileName, activeTab, props.fileType)
        }}
    />
  )
}

function triggerOperationModeAction(fileName: string, activeTab: number, fileType: string): void {   
  if (browserService.isTextView()) {
    return emitPlayFile(fileName, activeTab, fileType)
  } 
  const operationMode = getOutputSettings(activeTab)?.operationMode
  switch (operationMode) {
      case OperationMode.EDIT_VISIBILITY: 
          emitToggleVisibility(fileName, activeTab)
          break;
      case OperationMode.CONTROL:
      default:
          emitPlayFile(fileName, activeTab, fileType)
          break
  }
}

function emitToggleVisibility(fileName: string, activeTab: number): void {
  if (settingsService.isThumbnailSelectedOnAnyOutput(fileName, state.settings)) {
      alert('Unable to hide, as the file is in use somewhere.')
      return
  }      
  socketService.emitToggleThumbnailVisibility(activeTab, fileName)
}

function emitPlayFile(fileName: string, activeTab: number, fileType: string ): void {
  if (fileType === FileType.IMAGE) {
    socketService.emitPlayFile(activeTab, fileName)
  } else {
    const eventToFire = !getOutputSettings(activeTab)?.manualStartState 
      ? socketService.emitPlayFile
      : socketService.emitLoadFile
    eventToFire(activeTab, fileName)
  }   
}

function getOutputSettings(activeTab: number): OutputSettings {
  return settingsService.getOutputSettings(state.settings, activeTab)
}