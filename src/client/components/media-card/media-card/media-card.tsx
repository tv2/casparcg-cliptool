import React from "react"
import { BrowserService } from "../../../services/browser-service";
import { useSelector } from "react-redux";
import './media-card.scss'
import { SocketOperationService } from "../../../services/socket-operation-service";
import { SocketPlayService } from "../../../services/socket-play-service";
import { AppNavigationService } from "../../../../shared/services/app-navigation-service";
import { State } from "../../../../shared/reducers/index-reducer";
import { ReduxSettingsService } from "../../../../shared/services/redux-settings-service";
import { state } from "../../../../shared/store";
import { OperationMode } from "../../../../shared/models/settings-models";
import { FileType } from "../../../../shared/models/media-models";
import { SocketService } from "../../../services/socket-service";

interface MediaCardProps {
  fileName: string
  fileType: string
  activeTabIndex: number
  children?: React.ReactNode
  buttonClassName?: string
  wrapperClassName?: string
}

export default function MediaCard(props: MediaCardProps): JSX.Element {
  const activeTabIndex: number = useSelector(
    (state: State) => new AppNavigationService().getActiveTabIndex(state.appNavigation))
  useSelector(
    (state: State) => new ReduxSettingsService().getOutputSettings(state.settings, props.activeTabIndex)
      .selectedFileName
  )
  useSelector(
    (state: State) => new ReduxSettingsService().getOutputSettings(state.settings, props.activeTabIndex)
      .cuedFileName
    )
  
  const isSelected: boolean = new ReduxSettingsService().isThumbnailSelected(props.fileName, state.settings, activeTabIndex)
  const isCued: boolean = new ReduxSettingsService().isMediaCued(props.fileName, state.settings, activeTabIndex)

  const isSelectedClass = isSelected ? 'selected-thumbnail' : ''
  const chosenClass = isCued ? 'cued-thumbnail' : isSelectedClass

  return (
    <div className={`c-media-card ${props.wrapperClassName ?? ''} ${chosenClass}`}>
      <div
          className={`c-media-card__button ${props.buttonClassName ?? ''}`}
          onClick={() => {
            triggerOperationModeAction(props.fileName, props.activeTabIndex, props.fileType)
          }}
      > 
        {props.children ?? ''}
      </div>
    </div>
  )
}

function triggerOperationModeAction(fileName: string, activeTabIndex: number, fileType: string): void {   
  if (new BrowserService().isTextView()) {
    return playFile(fileName, activeTabIndex, fileType)
  } 
  const operationMode = new ReduxSettingsService().getOutputSettings(state.settings, activeTabIndex)?.operationMode
  switch (operationMode) {
      case OperationMode.EDIT_VISIBILITY: 
          toggleVisibility(fileName, activeTabIndex)
          break;
      case OperationMode.CONTROL:
      default:
          playFile(fileName, activeTabIndex, fileType)
          break
  }
}

function toggleVisibility(fileName: string, activeTabIndex: number): void {
  if (new ReduxSettingsService().isCardSelectedOnAnyOutput(fileName, state.settings) 
    || new ReduxSettingsService().isCardCuedOnAnyOutput(fileName, state.settings)) {
      alert('Unable to hide, as the file is in use somewhere.')
      return
  }
  new SocketOperationService(SocketService.instance.getSocket()).toggleThumbnailVisibility(activeTabIndex, fileName)
}

function playFile(fileName: string, activeTabIndex: number, fileType: string ): void {
  if (fileType === FileType.IMAGE) {
    new SocketPlayService(SocketService.instance.getSocket()).playFile(activeTabIndex, fileName)
  } else {
    const eventToFire = !new ReduxSettingsService().getOutputSettings(state.settings, activeTabIndex)?.manualStartState 
      ? () => new SocketPlayService(SocketService.instance.getSocket()).playFile(activeTabIndex, fileName)
      : () => new SocketPlayService(SocketService.instance.getSocket()).loadFile(activeTabIndex, fileName)
    eventToFire()
  }   
}