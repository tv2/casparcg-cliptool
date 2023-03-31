import React from 'react'
import '../../css/Thumbnail.css'
import '../app'
import mediaService from "../../../model/services/media-service";
import { useSelector } from 'react-redux';
import ImageThumbnail from './image-thumbnail';
import TextThumbnail from './text-thumbnail';
import settingsService from '../../../model/services/settings-service';
import { OperationMode } from '../../../model/reducers/settings-models';
import { HiddenFileInfo, MediaFile } from '../../../model/reducers/media-models';
import { State } from '../../../model/reducers/index-reducer';
import appNavigationService from '../../../model/services/app-navigation-service';
import browserService from '../../services/browser-service';

export function Thumbnails(): JSX.Element {
    const activeTab: number = useSelector(
        (state: State) => appNavigationService.getActiveTab(state.appNavigation))
    const files: MediaFile[] = useSelector(
        (state: State) => mediaService.getOutput(state).mediaFiles
    ) ?? []
    const hiddenFiles: Record<string, HiddenFileInfo> = useSelector(
        (state: State) => state.media.hiddenFiles
    ) ?? {}
    const isInEditVisibilityMode: boolean = useSelector(
        (state: State) => settingsService.getOutputSettings(state.settings, activeTab)
            .operationMode === OperationMode.EDIT_VISIBILITY
    ) ?? false
    const shownFiles: MediaFile[] = !isInEditVisibilityMode 
        ? files.filter(({ name }) => !(name in hiddenFiles)) 
        : files
    return (
        <div className="flexBoxes">
            {shownFiles.map((file: MediaFile) => (
                <div className="boxComponent" key={file.name}>
                    {browserService.isTextView()
                        ? <TextThumbnail file={file} />
                        : <ImageThumbnail file={file} />}
                </div>
            ))}
        </div>
    )    
}
