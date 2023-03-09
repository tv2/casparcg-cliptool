import React from "react"
import { useSelector } from "react-redux"
import { HiddenFileInfo, IMediaFile, OperationMode } from "../../../model/reducers/mediaReducer"
import mediaService from "../../services/mediaService";
import ThumbnailButton from "./ThumbnailButton";
import ThumbnailPicture from "./ThumbnailPicture";
import TimeCode from "./TimeCode";
import '../../css/Thumbnail.css'

interface ThumbnailUsingImageProps {
  file: IMediaFile
}

export default function ThumbnailUsingImage(props: ThumbnailUsingImageProps): JSX.Element {
  // Redux hook:
  useSelector(
    (storeUpdate: any) => mediaService.getOutput(storeUpdate)
            .tallyFile
  )

  const hiddenFiles: Record<string, HiddenFileInfo> = useSelector(
      (storeUpdate: any) => 
          storeUpdate.media[0].hiddenFiles
  ) ?? {}

  const classNames: string = [
      'thumb',
      props.file.name in hiddenFiles ? 'hidden' : ''
  ].join(' ')

  return (
    <div className={classNames}>
        <ThumbnailPicture file={props.file} />
        <ThumbnailButton file={props.file} />
        {mediaService.isThumbnailWithTally(props.file.name) ? (
            <TimeCode file={props.file} />
        ) : (
            ''
        )}
        <p className="text">
            {props.file.name
                .substring(props.file.name.lastIndexOf('/') + 1)
                .slice(-45)}
        </p>
    </div>
  )
}

