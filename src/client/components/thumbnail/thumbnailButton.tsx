import React from "react"
import { PGM_LOAD, PGM_PLAY, TOGGLE_THUMBNAIL_VISIBILITY } from "../../../model/socketIoConstants";
import mediaService from "../../../model/services/mediaService";
import { socket } from "../../util/socketClientHandlers";
import '../../css/Thumbnail.css'
import appNavigationService from "../../../model/services/appNavigationService";
import settingsService from "../../../model/services/settingsService";
import { OperationMode } from "../../../model/reducers/settingsModels";
import { MediaFile } from "../../../model/reducers/mediaModels";
import { reduxState } from "../../../model/reducers/store";

interface ThumbnailButtonProps {
  file: MediaFile
  isTextView?: boolean
}

export default function ThumbnailButton(props: ThumbnailButtonProps): JSX.Element {
  const classNames: string = props.isTextView ? 'thumbnail-text-view-ClickPgm' : 'thumbnailImageClickPgm'

  return (
    <button
        className={classNames}
        onClick={() => {
          triggerOperationModeAction(props.file.name)
        }}
    />
  )
}

function triggerOperationModeAction(fileName: string): void {    
  const operationMode = settingsService.getOutputSettings(reduxState)?.operationMode
  switch (operationMode) {
      case OperationMode.EDIT_VISIBILITY: 
          emitToggleVisibility(fileName)
          break;
      case OperationMode.CONTROL:
      default:
          emitPlayFile(fileName)
          break
  }
}

function emitToggleVisibility(fileName: string): void {
  if (mediaService.isThumbnailSelectedOnAnyOutput(fileName)) {
      alert('Unable to hide, as the file is in use somewhere.')
      return
  }
      
  socket.emit(TOGGLE_THUMBNAIL_VISIBILITY, appNavigationService.getActiveTab(), fileName)
}

function emitPlayFile(fileName: string ): void {
  const event = !settingsService.getOutputSettings(reduxState)?.manualStartState 
      ? PGM_PLAY 
      : PGM_LOAD
  socket.emit(event, appNavigationService.getActiveTab(), fileName)
}