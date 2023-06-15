import React from "react"
import { BrowserService } from "../../../services/browser-service";
import { useSelector } from "react-redux";
import './media-card.scss'
import { BackendOperationApi } from "../../../services/backend-operation-api";
import { BackendPlayApi } from "../../../services/backend-play-api";
import { AppNavigationService } from "../../../../shared/services/app-navigation-service";
import { State } from "../../../../shared/reducers/index-reducer";
import { SettingsService } from "../../../../shared/services/settings-service";
import { state } from "../../../../shared/store";
import { OperationMode } from "../../../../shared/models/settings-models";
import { FileType } from "../../../../shared/models/media-models";

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
    (state: State) => AppNavigationService.instance.getActiveTabIndex(state.appNavigation))
  useSelector(
    (state: State) => SettingsService.instance.getOutputSettings(state.settings, props.activeTabIndex)
      .selectedFileName
  )
  useSelector(
    (state: State) => SettingsService.instance.getOutputSettings(state.settings, props.activeTabIndex)
      .cuedFileName
    )
  
  const isSelected: boolean = SettingsService.instance.isThumbnailSelected(props.fileName, state.settings, activeTabIndex)
  const isCued: boolean = SettingsService.instance.isMediaCued(props.fileName, state.settings, activeTabIndex)

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
  if (BrowserService.instance.isTextView()) {
    return playFile(fileName, activeTabIndex, fileType)
  } 
  const operationMode = SettingsService.instance.getOutputSettings(state.settings, activeTabIndex)?.operationMode
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
  if (SettingsService.instance.isCardSelectedOnAnyOutput(fileName, state.settings) 
    || SettingsService.instance.isCardCuedOnAnyOutput(fileName, state.settings)) {
      alert('Unable to hide, as the file is in use somewhere.')
      return
  }
  BackendOperationApi.instance.emitToggleThumbnailVisibility(activeTabIndex, fileName)
}

function playFile(fileName: string, activeTabIndex: number, fileType: string ): void {
  if (fileType === FileType.IMAGE) {
    BackendPlayApi.instance.emitPlayFile(activeTabIndex, fileName)
  } else {
    const eventToFire = !SettingsService.instance.getOutputSettings(state.settings, activeTabIndex)?.manualStartState 
      ? () => BackendPlayApi.instance.emitPlayFile(activeTabIndex, fileName)
      : () => BackendPlayApi.instance.emitLoadFile(activeTabIndex, fileName)
    eventToFire()
  }   
}