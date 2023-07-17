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
    const browserService = new BrowserService()
    const appNavigationService = new AppNavigationService()
    const reduxMediaService = new ReduxMediaService()
    const reduxSettingsService = new ReduxSettingsService()

    const isTextView = browserService.isTextView()
    const activeTabIndex: number = useSelector(
        (state: State) => appNavigationService.getActiveTabIndex(state.appNavigation)
    )   
    const files: MediaFile[] = useSelector(
        (state: State) => reduxMediaService.getOutput(state.media, activeTabIndex)?.mediaFiles ?? []
    )
    const hiddenFiles: HiddenFiles = useSelector(
        (state: State) => state.media.hiddenFiles
    ) ?? {}
    const isInEditVisibilityMode: boolean = useSelector(
        (state: State) => reduxSettingsService.getOutputSettings(state.settings, activeTabIndex)
            .operationMode === OperationMode.EDIT_VISIBILITY
    ) ?? false
    const shownFiles: MediaFile[] = getShownFiles(files, isInEditVisibilityMode, hiddenFiles, browserService)
    return (
        <div className="c-media-overview">
            {shownFiles.map((file: MediaFile) => (
                <div className="c-media-overview__card" key={file.name}>
                    {isTextView
                        ? <TextMediaCard file={file} activeTabIndex={activeTabIndex}/>
                        : <ImageMediaCard file={file} activeTabIndex={activeTabIndex}/>}
                </div>
            ))}
        </div>
    )
}

function getShownFiles(files: MediaFile[], isInEditVisibilityMode: boolean, hiddenFiles: HiddenFiles, browserService: BrowserService): MediaFile[] {
    return  !isInEditVisibilityMode || browserService.isTextView()
        ? files.filter(({ name }) => !(name in hiddenFiles)) 
        : files
}
