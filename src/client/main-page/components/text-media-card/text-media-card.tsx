import React from "react";
import MediaCard from "../media-card/media-card";
import './text-media-card.scss'
import CardOverlayDisplay from "../card-overlay-display/card-overlay-display";
import { FileNameDisplay } from "../file-name-display/file-name-display";
import { MediaFile } from "../../../../shared/models/media-models";

interface TextMediaCardProps {
  file: MediaFile
  activeTabIndex: number
}

export default function TextMediaCard(props: TextMediaCardProps): JSX.Element {
  return (
    <div className="c-text-media-card" >
        <MediaCard 
          fileName={props.file.name} 
          wrapperClassName="c-text-media-card__wrapper" 
          buttonClassName="c-text-media-card__button" 
          fileType={props.file.type} 
          activeTabIndex={props.activeTabIndex}>
          <FileNameDisplay className="c-text-media-card__text" fileName={props.file.name} />              
          <CardOverlayDisplay className="text-view" activeTabIndex={props.activeTabIndex} file={props.file} />
        </MediaCard>  
    </div>
  )
}