import React from "react";
import ThumbnailButton from "../thumbnail-button/thumbnail-button";
import { MediaFile } from "../../../../model/reducers/media-models";
import './text-thumbnail.scss'
import ThumbnailOverlayDisplay from "../thumbnail-overlay-display/thumbnail-overlay-display";

interface TextThumbnailProps {
  file: MediaFile
  activeTab: number
}

export default function TextThumbnail(props: TextThumbnailProps): JSX.Element {
  return (
    <div className="c-text-thumbnail" >
        <ThumbnailButton 
          fileName={props.file.name} 
          wrapperClassNames="c-text-thumbnail__wrapper" 
          buttonClassNames="c-text-thumbnail__button" 
          fileType={props.file.type} 
          activeTab={props.activeTab}>
          <p className="c-text-thumbnail__text">
              {props.file.name
                  .substring(props.file.name.lastIndexOf('/') + 1)
                  .slice(-45)}
          </p>
        </ThumbnailButton>        
        <ThumbnailOverlayDisplay classNames="text-view" activeTab={props.activeTab} file={props.file} />        
        
    </div>
  )
}