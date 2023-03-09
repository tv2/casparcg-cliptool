import React from 'react'
import '../../css/Thumbnail.css'
import '../App'
import mediaService from "../../services/mediaService";
import { HiddenFileInfo, IMediaFile, OperationMode } from '../../../model/reducers/mediaReducer';
import { useSelector } from 'react-redux';
import { reduxState } from '../../../model/reducers/store';
import ThumbnailUsingImage from './ThumbnailUsingImage';
import ThumbnailUsingText from './ThumbnailUsingText';

export function Thumbnail(): JSX.Element {
    // Redux hook:
    const files: IMediaFile[] = useSelector(
        (storeUpdate: any) => mediaService.getOutput(storeUpdate)?.mediaFiles
    ) ?? []
    const hiddenFiles: Record<string, HiddenFileInfo> = useSelector(
        (storeUpdate: any) => storeUpdate.media[0].hiddenFiles
    ) ?? {}
    const isInEditVisibilityMode: boolean = useSelector(
        (storeUpdate: any) => mediaService.getOutput(storeUpdate)?.operationMode === OperationMode.EDIT_VISIBILITY
    ) ?? false
    const shownFiles: IMediaFile[] = !isInEditVisibilityMode 
        ? files.filter(({ name }) => !(name in hiddenFiles)) 
        : files
    // Render:    
    return (
        <div className="flexBoxes">
            {shownFiles?.map((file: IMediaFile, index: number) => (
                <div className="boxComponent" key={index}>
                    {reduxState.appNav[0].selectView === 0 
                        ? <ThumbnailUsingImage file={file} /> 
                        : <ThumbnailUsingText file={file} />}
                </div>
            ))}
        </div>
    )    
}
