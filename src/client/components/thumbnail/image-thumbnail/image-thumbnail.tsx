import React from "react"
import ThumbnailButton from "../thumbnail-button/thumbnail-button";
import ThumbnailPicture from "../thumbnail-picture/thumbnail-picture";
import {  MediaFile } from "../../../../model/reducers/media-models";
import './image-thumbnail.scss'
import ThumbnailOverlayDisplay from "../thumbnail-overlay-display/thumbnail-overlay-display";

interface ImageThumbnailProps {
  file: MediaFile
  activeTab: number
}

export default function ImageThumbnail(props: ImageThumbnailProps): JSX.Element {

  return (
    <div className="image-thumbnail">
        <ThumbnailButton fileName={props.file.name} fileType={props.file.type} activeTab={props.activeTab}> 
          <ThumbnailPicture fileName={props.file.name} />
          <ThumbnailOverlayDisplay activeTab={props.activeTab} file={props.file} />     
        </ThumbnailButton>        
        <p className="text">
            {props.file.name
                .substring(props.file.name.lastIndexOf('/') + 1)
                .slice(-45)}
        </p>
    </div>
  )
}

