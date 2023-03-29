import React from "react";
import { useSelector } from "react-redux"
import '../../css/Thumbnail.css'
import ThumbnailButton from "./thumbnail-button";
import TimeCode from "./timeCode";
import settingsService from "../../../model/services/settings-service";
import { MediaFile } from "../../../model/reducers/media-models";
import { State } from "../../../model/reducers/index-reducer";
import { reduxState } from "../../../model/reducers/store";
import appNavigationService from "../../../model/services/app-navigation-service";

interface TextThumbnailProps {
  file: MediaFile
}

export default function TextThumbnail(props: TextThumbnailProps): JSX.Element {
  const activeTab: number = useSelector(
    (storeUpdate: State) => appNavigationService.getActiveTab(storeUpdate.appNavigation))
  useSelector(
    (storeUpdate: State) => settingsService.getOutputSettings(storeUpdate.settings, activeTab)
      .selectedFile
  )
  const isSelected: boolean = settingsService.isThumbnailSelected(props.file.name, reduxState.settings, activeTab)
  const classNames: string = `thumbnail-text-view ${isSelected ? 'selected-thumb' : ''}`

return (
    <div className={classNames} >
        <ThumbnailButton file={props.file} buttonClassName="thumbnail-text-view-ClickPgm" />
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