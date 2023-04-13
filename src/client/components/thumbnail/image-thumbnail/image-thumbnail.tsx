import React from "react"
import { useSelector } from "react-redux"
import ThumbnailButton from "../thumbnail-button";
import ThumbnailPicture from "../thumbnail-picture/thumbnail-picture";
import { HiddenFileInfo, MediaFile } from "../../../../model/reducers/media-models";
import { State } from "../../../../model/reducers/index-reducer";
import appNavigationService from "../../../../model/services/app-navigation-service";
import './image-thumbnail.scss'
import ThumbnailOverlayDisplay from "../thumbnail-overlay-display";

interface ImageThumbnailProps {
  file: MediaFile
}

export default function ImageThumbnail(props: ImageThumbnailProps): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation)
  )
  const hiddenFiles: Record<string, HiddenFileInfo> = useSelector(
      (state: State) => 
          state.media.hiddenFiles
  ) ?? {}

  return (
    <div className={`thumbnail ${props.file.name in hiddenFiles ? 'hidden' : ''}`}>
        <ThumbnailPicture fileName={props.file.name} />
        <ThumbnailButton fileName={props.file.name} className="thumbnail-image-click-pgm" fileType={props.file.type}/>
        <ThumbnailOverlayDisplay activeTab={activeTab} file={props.file} />
        <p className="text">
            {props.file.name
                .substring(props.file.name.lastIndexOf('/') + 1)
                .slice(-45)}
        </p>
    </div>
  )
}

