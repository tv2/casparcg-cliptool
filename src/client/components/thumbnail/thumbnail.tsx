import React from 'react'
import '../../css/Thumbnail.css'
import '../app'
import mediaService from "../../../model/services/mediaService";
import { useSelector } from 'react-redux';
import { reduxState, ReduxStateType } from '../../../model/reducers/store';
import ThumbnailUsingImage from './thumbnailUsingImage';
import ThumbnailUsingText from './thumbnailUsingText';
import settingsService from '../../../model/services/settingsService';
import { OperationMode } from '../../../model/reducers/settingsModels';
import { HiddenFileInfo, MediaFile } from '../../../model/reducers/mediaModels';

export function Thumbnail(): JSX.Element {
    // Redux hook:
    const files: MediaFile[] = useSelector(
        (storeUpdate: ReduxStateType) => mediaService.getOutput(storeUpdate)?.mediaFiles
    ) ?? []
    const hiddenFiles: Record<string, HiddenFileInfo> = useSelector(
        (storeUpdate: ReduxStateType) => storeUpdate.media.hiddenFiles
    ) ?? {}
    const isInEditVisibilityMode: boolean = useSelector(
        (storeUpdate: ReduxStateType) => settingsService.getOutputSettings(storeUpdate)
            ?.operationMode === OperationMode.EDIT_VISIBILITY
    ) ?? false
    const shownFiles: MediaFile[] = !isInEditVisibilityMode 
        ? files.filter(({ name }) => !(name in hiddenFiles)) 
        : files
    // Render:    
    return (
        <div className="flexBoxes">
            {shownFiles?.map((file: MediaFile, index: number) => (
                <div className="boxComponent" key={index}>
                    {reduxState.appNav.selectView === 0 
                        ? <ThumbnailUsingImage file={file} /> 
                        : <ThumbnailUsingText file={file} />}
                </div>
            ))}
        </div>
    )    
}
