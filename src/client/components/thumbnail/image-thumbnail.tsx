import React from "react"
import { useSelector } from "react-redux"
import ThumbnailButton from "./thumbnail-button";
import ThumbnailPicture from "./thumbnail-picture";
import TimeCode from "./timeCode";
import '../../css/Thumbnail.css'
import settingsService from "../../../model/services/settings-service";
import { HiddenFileInfo, MediaFile } from "../../../model/reducers/media-models";
import { State } from "../../../model/reducers/index-reducer";
import { state } from "../../../model/reducers/store";
import appNavigationService from "../../../model/services/app-navigation-service";

interface ImageThumbnailProps {
  file: MediaFile
}

export default function ImageThumbnail(props: ImageThumbnailProps): JSX.Element {
  const activeTab: number = useSelector(
    (state: State) => appNavigationService.getActiveTab(state.appNavigation))
  useSelector(
    (state: State) => settingsService
      .getOutputSettings(state.settings, activeTab).selectedFile
  )

  const hiddenFiles: Record<string, HiddenFileInfo> = useSelector(
      (state: State) => 
          state.media.hiddenFiles
  ) ?? {}

  const classNames: string = `thumb ${props.file.name in hiddenFiles ? 'hidden' : ''}`

  return (
    <div className={classNames}>
        <ThumbnailPicture file={props.file} />
        <ThumbnailButton file={props.file} className="thumbnailImageClickPgm"/>
        {settingsService.isThumbnailSelected(props.file.name, state.settings, activeTab) && (
            <TimeCode file={props.file} />
        )}
        <p className="text">
            {props.file.name
                .substring(props.file.name.lastIndexOf('/') + 1)
                .slice(-45)}
        </p>
    </div>
  )
}

