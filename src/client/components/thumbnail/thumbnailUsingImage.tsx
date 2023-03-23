import React from "react"
import { useSelector } from "react-redux"
import mediaService from "../../../model/services/mediaService";
import ThumbnailButton from "./thumbnailButton";
import ThumbnailPicture from "./thumbnailPicture";
import TimeCode from "./timeCode";
import '../../css/Thumbnail.css'
import settingsService from "../../../model/services/settingsService";
import { HiddenFileInfo, MediaFile } from "../../../model/reducers/mediaModels";
import { ReduxStateType } from "../../../model/reducers/indexReducer";

interface ThumbnailUsingImageProps {
  file: MediaFile
}

export default function ThumbnailUsingImage(props: ThumbnailUsingImageProps): JSX.Element {
  // Redux hook:
  useSelector(
    (storeUpdate: ReduxStateType) => settingsService.getOutputSettings(storeUpdate)
            .selectedFile
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
        {mediaService.isThumbnailSelected(props.file.name) && (
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

