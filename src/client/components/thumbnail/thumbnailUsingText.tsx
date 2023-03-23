import React from "react";
import { useSelector } from "react-redux"
import mediaService from "../../../model/services/mediaService";

import '../../css/Thumbnail.css'
import ThumbnailButton from "./thumbnailButton";
import TimeCode from "./timeCode";
import settingsService from "../../../model/services/settingsService";
import { MediaFile } from "../../../model/reducers/mediaModels";
import { ReduxStateType } from "../../../model/reducers/indexReducer";

interface ThumbnailUsingTextProps {
  file: MediaFile
}

export default function ThumbnailUsingText(props: ThumbnailUsingTextProps): JSX.Element {
  // Redux hook:
  useSelector(
    (storeUpdate: ReduxStateType) => settingsService.getOutputSettings(storeUpdate)
      .selectedFile
  )
  const isSelected: boolean = mediaService.isThumbnailSelected(props.file.name)
  const classNames: string = `thumbnail-text-view ${isSelected ? 'selected-thumb' : ''}`

return (
    <div className={classNames} >
        <ThumbnailButton file={props.file} isTextView />
        {isSelected && (
            <TimeCode file={props.file} isTextView/>
        )}
        <p className="text-text-view">
            {props.file.name
                .substring(props.file.name.lastIndexOf('/') + 1)
                .slice(-45)}
        </p>
    </div>
  )
}