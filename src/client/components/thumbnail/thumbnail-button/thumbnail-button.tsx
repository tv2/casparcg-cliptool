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
  activeTab: number
  children?: React.ReactNode
  buttonClassNames?: string
  wrapperClassNames?: string
}

export default function ThumbnailButton(props: ThumbnailButtonProps): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation))
  useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, props.activeTab)
      .selectedFileName
  )
  useSelector(
    (state: State) => settingsService.getOutputSettings(state.settings, props.activeTab)
      .cuedFileName
    )
  
  const isSelected: boolean = settingsService.isThumbnailSelected(props.fileName, state.settings, activeTab)
  const isCued: boolean = settingsService.isThumbnailCued(props.fileName, state.settings, activeTab)

  const isSelectedClass = isSelected ? 'selected-thumbnail' : ''
  const chosenClass = isCued ? 'cued-thumbnail' : isSelectedClass

  return (
    <div className={`c-thumbnail-button ${props.wrapperClassNames ?? ''} ${chosenClass}`}>
      <Button
          classNames={`c-thumbnail-button__button ${props.buttonClassNames ?? ''}`}
          onClick={() => {
            triggerOperationModeAction(props.fileName, props.activeTab, props.fileType)
          }}
      > 
        {props.children ?? ''}
      </Button>
    </div>
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
      ? () => socketService.emitPlayFile(activeTab, fileName)
      : () => socketService.emitLoadFile(activeTab, fileName)
    eventToFire()
  }   
}

function getOutputSettings(activeTab: number): OutputSettings {
  return settingsService.getOutputSettings(state.settings, activeTab)
}