import React from "react";
import ThumbnailButton from "../thumbnail-button/thumbnail-button";
import { MediaFile } from "../../../../model/reducers/media-models";
import './text-thumbnail.scss'
import ThumbnailOverlayDisplay from "../thumbnail-overlay-display/thumbnail-overlay-display";

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
          <p className="c-text-thumbnail__text">
              {props.file.name
                  .substring(props.file.name.lastIndexOf('/') + 1)
                  .slice(-45)}
          </p>
        </ThumbnailButton>        
        <ThumbnailOverlayDisplay className="text-view" activeTabIndex={props.activeTabIndex} file={props.file} />        
        
    </div>
  )
}