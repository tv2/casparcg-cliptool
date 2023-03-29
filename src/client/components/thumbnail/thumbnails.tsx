import React from 'react'
import '../../css/Thumbnail.css'
import '../app'
import mediaService from "../../../model/services/mediaService";
import { useSelector } from 'react-redux';
import { reduxState } from '../../../model/reducers/store';
import ImageThumbnail from './image-thumbnail';
import TextThumbnail from './text-thumbnail';
import settingsService from '../../../model/services/settingsService';
import { OperationMode } from '../../../model/reducers/settingsModels';
import { HiddenFileInfo, MediaFile } from '../../../model/reducers/mediaModels';
import { ReduxStateType } from '../../../model/reducers/indexReducer';
import appNavigationService from '../../../model/services/appNavigationService';

export function Thumbnails(): JSX.Element {
    const activeTab: number = useSelector(
        (storeUpdate: ReduxStateType) => appNavigationService.getActiveTab(storeUpdate.appNavigation))
    const files: MediaFile[] = useSelector(
        (storeUpdate: ReduxStateType) => mediaService.getOutput(storeUpdate)?.mediaFiles
    ) ?? []
    const hiddenFiles: Record<string, HiddenFileInfo> = useSelector(
        (storeUpdate: ReduxStateType) => storeUpdate.media.hiddenFiles
    ) ?? {}
    const isInEditVisibilityMode: boolean = useSelector(
        (storeUpdate: ReduxStateType) => settingsService.getOutputSettings(storeUpdate.settings, activeTab)
            ?.operationMode === OperationMode.EDIT_VISIBILITY
    ) ?? false
    const shownFiles: MediaFile[] = !isInEditVisibilityMode 
        ? files.filter(({ name }) => !(name in hiddenFiles)) 
        : files
    return (
        <div className="flexBoxes">
            {shownFiles?.map((file: MediaFile, index: number) => (
                <div className="boxComponent" key={index}>
                    {reduxState.appNavigation.selectView === 0 
                        ? <ImageThumbnail file={file} /> 
                        : <TextThumbnail file={file} />}
                </div>
            ))}
        </div>
    )    
}
