import React from "react"
import browserService from "../../../services/browser-service";
import { useSelector } from "react-redux";
import './media-card.scss'
import backendOperationApi from "../../../services/backend-operation-api";
import backendPlayApi from "../../../services/backend-play-api";
import appNavigationService from "../../../../shared/services/app-navigation-service";
import { State } from "../../../../shared/reducers/index-reducer";
import settingsService from "../../../../shared/services/settings-service";
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
  if (browserService.isTextView()) {
    return playFile(fileName, activeTabIndex, fileType)
  } 
  const operationMode = settingsService.getOutputSettings(state.settings, activeTabIndex)?.operationMode
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
  if (settingsService.isCardSelectedOnAnyOutput(fileName, state.settings) 
    || settingsService.isCardCuedOnAnyOutput(fileName, state.settings)) {
      alert('Unable to hide, as the file is in use somewhere.')
      return
  }
  backendOperationApi.emitToggleThumbnailVisibility(activeTabIndex, fileName)
}

function playFile(fileName: string, activeTabIndex: number, fileType: string ): void {
  if (fileType === FileType.IMAGE) {
    backendPlayApi.emitPlayFile(activeTabIndex, fileName)
  } else {
    const eventToFire = !settingsService.getOutputSettings(state.settings, activeTabIndex)?.manualStartState 
      ? () => backendPlayApi.emitPlayFile(activeTabIndex, fileName)
      : () => backendPlayApi.emitLoadFile(activeTabIndex, fileName)
    eventToFire()
  }   
}