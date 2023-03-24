import React from "react"
import { PGM_LOAD, PGM_PLAY, TOGGLE_THUMBNAIL_VISIBILITY } from "../../../model/socketIoConstants";
import { socket } from "../../util/socketClientHandlers";
import '../../css/Thumbnail.css'
import appNavigationService from "../../../model/services/appNavigationService";
import settingsService from "../../../model/services/settingsService";
import { OperationMode } from "../../../model/reducers/settingsModels";
import { MediaFile } from "../../../model/reducers/mediaModels";
import { reduxState } from "../../../model/reducers/store";
import { useSelector } from "react-redux";
import { ReduxStateType } from "../../../model/reducers/indexReducer";

interface ThumbnailButtonProps {
  file: MediaFile
  isTextView?: boolean
}

export default function ThumbnailButton(props: ThumbnailButtonProps): JSX.Element {
  const activeTab: number = useSelector(
    (storeUpdate: ReduxStateType) => appNavigationService.getActiveTab(storeUpdate.appNavigation))
  const classNames: string = props.isTextView ? 'thumbnail-text-view-ClickPgm' : 'thumbnailImageClickPgm'

  return (
    <button
        className={classNames}
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