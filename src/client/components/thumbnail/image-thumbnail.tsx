import React from "react"
import { useSelector } from "react-redux"
import ThumbnailButton from "./thumbnail-button";
import ThumbnailPicture from "./thumbnail-picture";
import TimeCode from "./timeCode";
import '../../css/Thumbnail.css'
import settingsService from "../../../model/services/settings-service";
import { HiddenFileInfo, MediaFile } from "../../../model/reducers/media-models";
import { State } from "../../../model/reducers/index-reducer";
import appNavigationService from "../../../model/services/app-navigation-service";
import { state } from "../../../model/reducers/store";

interface ImageThumbnailProps {
  file: MediaFile
}

export default function ImageThumbnail(props: ImageThumbnailProps): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation)
  )
  useSelector(
    (state: State) => settingsService
      .getOutputSettings(state.settings, activeTab).selectedFile
  )

  const hiddenFiles: Record<string, HiddenFileInfo> = useSelector(
      (state: State) => 
          state.media.hiddenFiles
  ) ?? {}
  const isSelected: boolean = settingsService.isThumbnailSelected(props.file.name, state.settings, activeTab)
  const classNames: string = `thumb ${props.file.name in hiddenFiles ? 'hidden' : ''}`

  return (
    <div className={classNames}>
        <ThumbnailPicture fileName={props.file.name} />
        <ThumbnailButton fileName={props.file.name} className="thumbnailImageClickPgm"/>
        {isSelected && (
            <TimeCode />
        )}
        <p className="text">
            {props.file.name
                .substring(props.file.name.lastIndexOf('/') + 1)
                .slice(-45)}
        </p>
    </div>
  )
}

