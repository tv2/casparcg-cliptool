import React from "react"
import { useSelector } from "react-redux"
import ThumbnailButton from "./thumbnailButton";
import ThumbnailPicture from "./thumbnailPicture";
import TimeCode from "./timeCode";
import '../../css/Thumbnail.css'
import settingsService from "../../../model/services/settingsService";
import { HiddenFileInfo, MediaFile } from "../../../model/reducers/mediaModels";
import { ReduxStateType } from "../../../model/reducers/indexReducer";
import { reduxState } from "../../../model/reducers/store";
import appNavigationService from "../../../model/services/appNavigationService";

interface ThumbnailUsingImageProps {
  file: MediaFile
}

export default function ThumbnailUsingImage(props: ThumbnailUsingImageProps): JSX.Element {
  const activeTab: number = useSelector(
    (storeUpdate: ReduxStateType) => appNavigationService.getActiveTab(storeUpdate.appNavigation))
  useSelector(
    (storeUpdate: ReduxStateType) => settingsService
      .getOutputSettings(storeUpdate.settings, activeTab).selectedFile
  )

  const hiddenFiles: Record<string, HiddenFileInfo> = useSelector(
      (storeUpdate: ReduxStateType) => 
          storeUpdate.media.hiddenFiles
  ) ?? {}

  const classNames: string = `thumb ${props.file.name in hiddenFiles ? 'hidden' : ''}`

  return (
    <div className={classNames}>
        <ThumbnailPicture file={props.file} />
        <ThumbnailButton file={props.file} />
        {settingsService.isThumbnailSelected(props.file.name, reduxState.settings, activeTab) && (
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

