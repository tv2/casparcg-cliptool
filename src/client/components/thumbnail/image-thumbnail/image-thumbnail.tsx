import React from "react"
import { useSelector } from "react-redux"
import ThumbnailButton from "../thumbnail-button/thumbnail-button";
import ThumbnailPicture from "../thumbnail-picture/thumbnail-picture";
import { HiddenFileInfo, MediaFile } from "../../../../model/reducers/media-models";
import { State } from "../../../../model/reducers/index-reducer";
import './image-thumbnail.scss'
import ThumbnailOverlayDisplay from "../thumbnail-overlay-display/thumbnail-overlay-display";
import { FileNameDisplay } from "../file-name-display/file-name-display";

interface ImageThumbnailProps {
  file: MediaFile
  activeTabIndex: number
}

export default function ImageThumbnail(props: ImageThumbnailProps): JSX.Element {
  const hiddenFiles: Record<string, HiddenFileInfo> = useSelector(
      (state: State) => 
          state.media.hiddenFiles
  ) ?? {}

  return (
    <div className={`image-thumbnail ${props.file.name in hiddenFiles ? 'hidden' : ''}`}>
        <ThumbnailButton fileName={props.file.name} fileType={props.file.type} activeTabIndex={props.activeTabIndex}> 
          <ThumbnailPicture fileName={props.file.name} />
          <ThumbnailOverlayDisplay activeTabIndex={props.activeTabIndex} file={props.file} />     
        </ThumbnailButton>        
        <FileNameDisplay className="text" fileName={props.file.name}/>            
    </div>
  )
}

