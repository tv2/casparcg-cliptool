import React from "react"
import settingsService from "../../../../model/services/settings-service";
import { OperationMode, OutputSettings } from "../../../../model/reducers/settings-models";
import { state } from "../../../../model/reducers/store";
import Button from "../../shared/button";
import browserService from "../../../services/browser-service";
import socketService from "../../../services/socket-service";
import { FileType } from "../../../../model/reducers/media-models";
import { useSelector } from "react-redux";
import appNavigationService from "../../../../model/services/app-navigation-service";
import { State } from "../../../../model/reducers/index-reducer";
import './thumbnail-button.scss'

interface ThumbnailButtonProps {
  fileName: string
  fileType: string
  activeTabIndex: number
  children?: React.ReactNode
  buttonClassName?: string
  wrapperClassName?: string
}

export default function ThumbnailButton(props: ThumbnailButtonProps): JSX.Element {
  const activeTabIndex: number = useSelector(
    (state: State) => appNavigationService.getActiveTabIndex(state.appNavigation))
  useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, props.activeTabIndex)
      .selectedFileName
  )
  useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, props.activeTabIndex)
      .cuedFileName
    )
  
  const isSelected: boolean = settingsService.isThumbnailSelected(props.fileName, state.settings, activeTabIndex)
  const isCued: boolean = settingsService.isMediaCued(props.fileName, state.settings, activeTabIndex)

  const isSelectedClass = isSelected ? 'selected-thumbnail' : ''
  const chosenClass = isCued ? 'cued-thumbnail' : isSelectedClass

  return (
    <div className={`c-thumbnail-button ${props.wrapperClassName ?? ''} ${chosenClass}`}>
      <Button
          className={`c-thumbnail-button__button ${props.buttonClassName ?? ''}`}
          onClick={() => {
            triggerOperationModeAction(props.fileName, props.activeTabIndex, props.fileType)
          }}
      > 
        {props.children ?? ''}
      </Button>
    </div>
  )
}

function triggerOperationModeAction(fileName: string, activeTabIndex: number, fileType: string): void {   
  if (browserService.isTextView()) {
    return emitPlayFile(fileName, activeTabIndex, fileType)
  } 
  const operationMode = getOutputSettings(activeTabIndex)?.operationMode
  switch (operationMode) {
      case OperationMode.EDIT_VISIBILITY: 
          emitToggleVisibility(fileName, activeTabIndex)
          break;
      case OperationMode.CONTROL:
      default:
          emitPlayFile(fileName, activeTabIndex, fileType)
          break
  }
}

function emitToggleVisibility(fileName: string, activeTabIndex: number): void {
  if (settingsService.isThumbnailSelectedOnAnyOutput(fileName, state.settings)) {
      alert('Unable to hide, as the file is in use somewhere.')
      return
  }
  socketService.emitToggleThumbnailVisibility(activeTabIndex, fileName)
}

function emitPlayFile(fileName: string, activeTabIndex: number, fileType: string ): void {
  if (fileType === FileType.IMAGE) {
    socketService.emitPlayFile(activeTabIndex, fileName)
  } else {
    const eventToFire = !getOutputSettings(activeTabIndex)?.manualStartState 
      ? () => socketService.emitPlayFile(activeTabIndex, fileName)
      : () => socketService.emitLoadFile(activeTabIndex, fileName)
    eventToFire()
  }   
}

function getOutputSettings(activeTabIndex: number): OutputSettings {
  return settingsService.getOutputSettings(state.settings, activeTabIndex)
}