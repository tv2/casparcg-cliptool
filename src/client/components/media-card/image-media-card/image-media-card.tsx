import React from "react"
import { useSelector } from "react-redux"
import MediaCard from "../media-card/media-card";
import './image-media-card.scss'
import CardOverlayDisplay from "../card-overlay-display/card-overlay-display";
import { FileNameDisplay } from "../file-name-display/file-name-display";
import { HiddenFiles, MediaFile } from "../../../../shared/models/media-models";
import { State } from "../../../../shared/reducers/index-reducer";
import { MediaService } from "../../../../shared/services/media-service";
import { state } from "../../../../shared/store";

interface ImageMediaCardProps {
  file: MediaFile
  activeTabIndex: number
}

export default function ImageMediaCard(props: ImageMediaCardProps): JSX.Element {
  const hiddenFiles: HiddenFiles = useSelector(
      (state: State) => 
          state.media.hiddenFiles
  )
  const url: string = MediaService.instance.getBase64ThumbnailUrl(props.file.name, props.activeTabIndex || 0, state.media)
  const isHidden: boolean = props.file.name in hiddenFiles

  return (
    <div className={`c-image-media-card ${isHidden ? 'hidden' : ''}`}>
        <MediaCard fileName={props.file.name} fileType={props.file.type} activeTabIndex={props.activeTabIndex}> 
          <img src={url} className={`c-image-media-card__image ${isHidden ? 'grayscale' : ''}`}/>
          <CardOverlayDisplay activeTabIndex={props.activeTabIndex} file={props.file} />     
        </MediaCard>        
        <FileNameDisplay className="text" fileName={props.file.name}/>            
    </div>
  )
}
