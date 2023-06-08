import React from "react"
import { useSelector } from "react-redux"
import MediaCard from "../media-card/media-card";
import './image-media-card.scss'
import CardOverlayDisplay from "../card-overlay-display/card-overlay-display";
import { FileNameDisplay } from "../file-name-display/file-name-display";
import { HiddenFileInfo, MediaFile } from "../../../../shared/models/media-models";
import { State } from "../../../../shared/reducers/index-reducer";
import appNavigationService from "../../../../shared/services/app-navigation-service";
import mediaService from "../../../../shared/services/media-service";
import { state } from "../../../../shared/store";

interface ImageMediaCardProps {
  file: MediaFile
  activeTabIndex: number
}

export default function ImageMediaCard(props: ImageMediaCardProps): JSX.Element {
  const hiddenFiles: Record<string, HiddenFileInfo> = useSelector(
      (state: State) => 
          state.media.hiddenFiles
  )
  const activeTabIndex: number = useSelector(
    (state: State) => appNavigationService.getActiveTabIndex(state.appNavigation))
  const url: string = mediaService.getBase64ThumbnailUrl(props.file.name, activeTabIndex || 0, state.media)

  return (
    <div className={`c-image-media-card ${props.file.name in hiddenFiles ? 'hidden' : ''}`}>
        <MediaCard fileName={props.file.name} fileType={props.file.type} activeTabIndex={props.activeTabIndex}> 
          <img src={url} className="c-image-media-card__image"/>
          <CardOverlayDisplay activeTabIndex={props.activeTabIndex} file={props.file} />     
        </MediaCard>        
        <FileNameDisplay className="text" fileName={props.file.name}/>            
    </div>
  )
}

