import React from 'react'
import { useSelector } from 'react-redux';
import ImageMediaCard from '../image-media-card/image-media-card';
import TextMediaCard from '../text-media-card/text-media-card';
import './media-overview.scss'
import { AppNavigationService } from '../../../../shared/services/app-navigation-service';
import { State } from '../../../../shared/reducers/index-reducer';
import { HiddenFiles, MediaFile } from '../../../../shared/models/media-models';
import { ReduxMediaService } from '../../../../shared/services/redux-media-service';
import { ReduxSettingsService } from '../../../../shared/services/redux-settings-service';
import { OperationMode } from '../../../../shared/models/settings-models';
import { BrowserService } from '../../../shared/services/browser-service';

export function MediaOverview(): JSX.Element {
    const activeTabIndex: number = useSelector(
        (state: State) => new AppNavigationService().getActiveTabIndex(state.appNavigation))   
    const files: MediaFile[] = useSelector(
        (state: State) => new ReduxMediaService().getOutput(state.media, activeTabIndex)?.mediaFiles ?? []
    )
    const hiddenFiles: HiddenFiles = useSelector(
        (state: State) => state.media.hiddenFiles
    ) ?? {}
    const isInEditVisibilityMode: boolean = useSelector(
        (state: State) => new ReduxSettingsService().getOutputSettings(state.settings, activeTabIndex)
            .operationMode === OperationMode.EDIT_VISIBILITY
    ) ?? false
    const shownFiles: MediaFile[] = getShownFiles(files, isInEditVisibilityMode, hiddenFiles)
    return (
        <div className="c-media-overview">
            {shownFiles.map((file: MediaFile) => (
                <div className="c-media-overview__card" key={file.name}>
                    {new BrowserService().isTextView()
                        ? <TextMediaCard file={file} activeTabIndex={activeTabIndex}/>
                        : <ImageMediaCard file={file} activeTabIndex={activeTabIndex}/>}
                </div>
            ))}
        </div>
    )
}

function getShownFiles(files: MediaFile[], isInEditVisibilityMode: boolean, hiddenFiles: HiddenFiles): MediaFile[] {
    return  !isInEditVisibilityMode || new BrowserService().isTextView()
        ? files.filter(({ name }) => !(name in hiddenFiles)) 
        : files
}
