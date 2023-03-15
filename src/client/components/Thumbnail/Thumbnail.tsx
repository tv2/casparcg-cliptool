import React from 'react'
import '../../css/Thumbnail.css'
import '../App'
import mediaService from "../../../model/services/mediaService";
import { HiddenFileInfo, MediaFile } from '../../../model/reducers/mediaReducer';
import { useSelector } from 'react-redux';
import { reduxState, ReduxStateType } from '../../../model/reducers/store';
import ThumbnailUsingImage from './ThumbnailUsingImage';
import ThumbnailUsingText from './ThumbnailUsingText';
import { OperationMode } from '../../../model/reducers/settingsReducer';
import settingsService from '../../../model/services/settingsService';

export function Thumbnail(): JSX.Element {
    // Redux hook:
    const files: MediaFile[] = useSelector(
        (storeUpdate: ReduxStateType) => mediaService.getOutput(storeUpdate)?.mediaFiles
    ) ?? []
    const hiddenFiles: Record<string, HiddenFileInfo> = useSelector(
        (storeUpdate: ReduxStateType) => storeUpdate.media[0].hiddenFiles
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
                    {reduxState.appNav[0].selectView === 0 
                        ? <ThumbnailUsingImage file={file} /> 
                        : <ThumbnailUsingText file={file} />}
                </div>
            ))}
        </div>
    )    
}
