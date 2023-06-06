import React from "react";
import ThumbnailButton from "../thumbnail-button/thumbnail-button";
import { MediaFile } from "../../../../model/reducers/media-models";
import './text-thumbnail.scss'
import ThumbnailOverlayDisplay from "../thumbnail-overlay-display/thumbnail-overlay-display";
import { FileNameDisplay } from "../file-name-display/file-name-display";

interface TextThumbnailProps {
  file: MediaFile
  activeTabIndex: number
}

export default function TextThumbnail(props: TextThumbnailProps): JSX.Element {
  return (
    <div className="c-text-thumbnail" >
        <ThumbnailButton 
          fileName={props.file.name} 
          wrapperClassName="c-text-thumbnail__wrapper" 
          buttonClassName="c-text-thumbnail__button" 
          fileType={props.file.type} 
          activeTabIndex={props.activeTabIndex}>
          <FileNameDisplay className="c-text-thumbnail__text" fileName={props.file.name} />              
          <ThumbnailOverlayDisplay className="text-view" activeTabIndex={props.activeTabIndex} file={props.file} />
        </ThumbnailButton>  
    </div>
  )
}