import React from 'react'
import '../../css/Thumbnail.css'
import '../app'
import mediaService from "../../../model/services/media-service";
import { useSelector } from 'react-redux';
import { reduxState } from '../../../model/reducers/store';
import ImageThumbnail from './image-thumbnail';
import TextThumbnail from './text-thumbnail';
import settingsService from '../../../model/services/settings-service';
import { OperationMode } from '../../../model/reducers/settings-models';
import { HiddenFileInfo, MediaFile } from '../../../model/reducers/media-models';
import { State } from '../../../model/reducers/index-reducer';
import appNavigationService from '../../../model/services/app-navigation-service';

export function Thumbnails(): JSX.Element {
    const activeTab: number = useSelector(
        (storeUpdate: State) => appNavigationService.getActiveTab(storeUpdate.appNavigation))
    const files: MediaFile[] = useSelector(
        (storeUpdate: State) => mediaService.getOutput(storeUpdate)?.mediaFiles
    ) ?? []
    const hiddenFiles: Record<string, HiddenFileInfo> = useSelector(
        (storeUpdate: State) => storeUpdate.media.hiddenFiles
    ) ?? {}
    const isInEditVisibilityMode: boolean = useSelector(
        (storeUpdate: State) => settingsService.getOutputSettings(storeUpdate.settings, activeTab)
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
