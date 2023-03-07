import React from "react"
import { IMediaFile, OperationMode } from "../../../model/reducers/mediaReducer"
import { reduxState } from "../../../model/reducers/store"
import { PGM_LOAD, PGM_PLAY, TOGGLE_THUMBNAIL_VISIBILITY } from "../../../model/SocketIoConstants";
import MediaService from "../../services/mediaService";
import { socket } from "../../util/SocketClientHandlers";
import '../../css/Thumbnail.css'

interface ThumbnailButtonProps {
  file: IMediaFile
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
  const operationMode = MediaService.getOutput(reduxState)?.operationMode
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
  if (MediaService.isThumbnailWithTallyOnAnyOutput(fileName)) {
      alert('Unable to hide, as the file is in use somewhere.')
      return
  }
      
  socket.emit(TOGGLE_THUMBNAIL_VISIBILITY, MediaService.getActiveTab(), fileName)
}

function emitPlayFile(fileName: string ): void {
  const event = !MediaService.getOutput(reduxState)?.manualstartState 
      ? PGM_PLAY 
      : PGM_LOAD
  socket.emit(event, MediaService.getActiveTab(), fileName)
}