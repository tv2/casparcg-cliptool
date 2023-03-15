import React from "react";
import { useSelector } from "react-redux"
import { MediaFile } from "../../../model/reducers/mediaReducer";
import mediaService from "../../../model/services/mediaService";

import '../../css/Thumbnail.css'
import ThumbnailButton from "./ThumbnailButton";
import TimeCode from "./TimeCode";
import { ReduxStateType } from "../../../model/reducers/store";
import settingsService from "../../../model/services/settingsService";

interface ThumbnailUsingTextProps {
  file: MediaFile
}

export default function ThumbnailUsingText(props: ThumbnailUsingTextProps): JSX.Element {
  // Redux hook:
  useSelector(
    (storeUpdate: ReduxStateType) => settingsService.getOutputSettings(storeUpdate)
      .selectedFile
  )
  const isTallyFile: boolean = mediaService.isThumbnailWithTally(props.file.name)
  const classNames: string = [
    'thumbnail-text-view',
    isTallyFile ? 'selected-thumb' : ''
  ].join(' ')

return (
    <div className={classNames} >
        <ThumbnailButton file={props.file} isTextView />
        {isTallyFile ? (
            <TimeCode file={props.file} isTextView/>
        ) : (
            ''
        )}
        <p className="text-text-view">
            {props.file.name
                .substring(props.file.name.lastIndexOf('/') + 1)
                .slice(-45)}
        </p>
    </div>
  )
}