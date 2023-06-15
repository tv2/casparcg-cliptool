import React from 'react'
import { useSelector } from 'react-redux';
import ImageMediaCard from '../image-media-card/image-media-card';
import TextMediaCard from '../text-media-card/text-media-card';
import { BrowserService } from '../../../services/browser-service';
import './media-overview.scss'
import { AppNavigationService } from '../../../../shared/services/app-navigation-service';
import { State } from '../../../../shared/reducers/index-reducer';
import { HiddenFiles, MediaFile } from '../../../../shared/models/media-models';
import { MediaService } from '../../../../shared/services/media-service';
import { SettingsService } from '../../../../shared/services/settings-service';
import { OperationMode } from '../../../../shared/models/settings-models';

export function MediaOverview(): JSX.Element {
    const activeTabIndex: number = useSelector(
        (state: State) => AppNavigationService.instance.getActiveTabIndex(state.appNavigation))   
    const files: MediaFile[] = useSelector(
        (state: State) => MediaService.instance.getOutput(state.media, activeTabIndex)?.mediaFiles ?? []
    )
    const hiddenFiles: HiddenFiles = useSelector(
        (state: State) => state.media.hiddenFiles
    ) ?? {}
    const isInEditVisibilityMode: boolean = useSelector(
        (state: State) => SettingsService.instance.getOutputSettings(state.settings, activeTabIndex)
            .operationMode === OperationMode.EDIT_VISIBILITY
    ) ?? false
    const shownFiles: MediaFile[] = getShownFiles(files, isInEditVisibilityMode, hiddenFiles)
    return (
        <div className="c-media-overview">
            {shownFiles.map((file: MediaFile) => (
                <div className="c-media-overview__card" key={file.name}>
                    {BrowserService.instance.isTextView()
                        ? <TextMediaCard file={file} activeTabIndex={activeTabIndex}/>
                        : <ImageMediaCard file={file} activeTabIndex={activeTabIndex}/>}
                </div>
            ))}
        </div>
    )
}

function getShownFiles(files: MediaFile[], isInEditVisibilityMode: boolean, hiddenFiles: HiddenFiles): MediaFile[] {
    return  !isInEditVisibilityMode || BrowserService.instance.isTextView()
        ? files.filter(({ name }) => !(name in hiddenFiles)) 
        : files
}
