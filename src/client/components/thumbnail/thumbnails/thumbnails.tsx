import React from 'react'
import mediaService from "../../../../model/services/media-service";
import { useSelector } from 'react-redux';
import ImageThumbnail from '../image-thumbnail/image-thumbnail';
import TextThumbnail from '../text-thumbnail/text-thumbnail';
import settingsService from '../../../../model/services/settings-service';
import { OperationMode } from '../../../../model/reducers/settings-models';
import { HiddenFileInfo, MediaFile } from '../../../../model/reducers/media-models';
import { State } from '../../../../model/reducers/index-reducer';
import appNavigationService from '../../../../model/services/app-navigation-service';
import browserService from '../../../services/browser-service';
import './thumbnails.scss'

export function Thumbnails(): JSX.Element {
    const activeTabIndex: number = useSelector(
        (state: State) => appNavigationService.getActiveTabIndex(state.appNavigation))   
    const files: MediaFile[] = useSelector(
        (state: State) => mediaService.getOutput(state.media, activeTabIndex)?.mediaFiles ?? []
    )
    const hiddenFiles: Record<string, HiddenFileInfo> = useSelector(
        (state: State) => state.media.hiddenFiles
    ) ?? {}
    const isInEditVisibilityMode: boolean = useSelector(
        (state: State) => settingsService.getOutputSettings(state.settings, activeTabIndex)
            .operationMode === OperationMode.EDIT_VISIBILITY
    ) ?? false
    const shownFiles: MediaFile[] = !isInEditVisibilityMode || browserService.isTextView()
        ? files.filter(({ name }) => !(name in hiddenFiles)) 
        : files
    return (
        <div className="thumbnails-region">
            {shownFiles.map((file: MediaFile) => (
                <div className="thumbnail-wrapper" key={file.name}>
                    {browserService.isTextView()
                        ? <TextThumbnail file={file} activeTabIndex={activeTabIndex}/>
                        : <ImageThumbnail file={file} activeTabIndex={activeTabIndex}/>}
                </div>
            ))}
        </div>
    )    
}
