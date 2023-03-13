import React from "react";
import { useSelector } from "react-redux"
import { IMediaFile } from "../../../model/reducers/mediaReducer";
import mediaService from "../../services/mediaService";

import '../../css/Thumbnail.css'
import ThumbnailButton from "./ThumbnailButton";
import TimeCode from "./TimeCode";
import { ReduxStateType } from "../../../model/reducers/store";

interface ThumbnailUsingTextProps {
  file: IMediaFile
}

export default function ThumbnailUsingText(props: ThumbnailUsingTextProps): JSX.Element {
  // Redux hook:
  useSelector(
    (storeUpdate: ReduxStateType) => mediaService.getOutput(storeUpdate)
        .tallyFile
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