import React from "react"
import { PGM_LOAD, PGM_PLAY, TOGGLE_THUMBNAIL_VISIBILITY } from "../../../model/SocketIoConstants";
import mediaService from "../../../model/services/mediaService";
import { socket } from "../../util/SocketClientHandlers";
import '../../css/Thumbnail.css'
import appNavigationService from "../../../model/services/appNavigationService";
import settingsService from "../../../model/services/settingsService";
import { OperationMode } from "../../../model/reducers/settingsModels";
import { MediaFile } from "../../../model/reducers/mediaModels";

interface ThumbnailButtonProps {
  file: MediaFile
  isTextView?: boolean
}

export default function ThumbnailButton(props: ThumbnailButtonProps): JSX.Element {
  const classNames: string = [
    props.isTextView ? 'thumbnail-text-view-ClickPgm' : 'thumbnailImageClickPgm'
  ].join(' ')

  return (
    <button
            className={classNames}
            onClick={() => {
                handleClickMedia(props.file.name)
            }}
    ></button>
  )
}

function handleClickMedia(fileName: string): void {    
  const operationMode = settingsService.getOutputSettings()?.operationMode
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
  const event = !settingsService.getOutputSettings()?.manualStartState 
      ? PGM_PLAY 
      : PGM_LOAD
  socket.emit(event, appNavigationService.getActiveTab(), fileName)
}