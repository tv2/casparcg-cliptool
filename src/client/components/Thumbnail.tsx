import React from 'react'
import '../css/Thumbnail.css'
import './App'
import { reduxState } from '../../model/reducers/store'
import { secondsToTimeCode } from '../util/TimeCodeToString'

//Redux:
import { HiddenFileInfo, IMediaFile, IOutput, IThumbnailFile, OperationMode } from '../../model/reducers/mediaReducer'
import { socket } from '../util/SocketClientHandlers'
import { PGM_LOAD, PGM_PLAY, TOGGLE_THUMBNAIL_VISIBILITY } from '../../model/SocketIoConstants'
import { useSelector } from 'react-redux'

interface ThumbnailProps {
    file: IMediaFile
}

// TODO: during UT-210, figure out the correct type to apply instead of 'any'.
function getActiveOutput(store: any, channelIndex: number = -1): IOutput {
    const activeTab: number = channelIndex === -1 
        ? reduxState.appNav[0].activeTab 
        : channelIndex
    return store.media[0].output[activeTab]
}

export function findThumbnail(fileName: string, channelIndex: number): string {
    const thumb = getActiveOutput(reduxState, channelIndex)?.thumbnailList
        .find(
            (item: IThumbnailFile) => item.name.toUpperCase() === (fileName.toUpperCase())
        )
    return thumb?.thumbnail ?? ''
}

function isThumbnailWithTallyOnAnyOutput(thumbnailName: string): boolean {
    return reduxState.media[0].output.some(
        output => getCleanTallyFile(output) === thumbnailName)
}

export function getCleanTallyFile(output: IOutput): string {
    const tallyFileName = output
        .tallyFile
        .toUpperCase()
        .replace(/\\/g, '/')
        .replace('//', '/')
        .split('.')
    // Remove system Path e.g.: D:\\media/:
    const tallyNoMediaPath = tallyFileName[0].replace(
        reduxState.settings[0].ccgConfig.path
            ?.toUpperCase()
            .replace(/\\/g, '/') + '/',
        ''
    )
    return tallyNoMediaPath
}

const isThumbWithTally = (thumbName: string): boolean => {
    const tallyNoMediaPath = getCleanTallyFile(getActiveOutput(reduxState))
    return tallyNoMediaPath === thumbName
}

export function Thumbnail(): JSX.Element {
    // Redux hook:
    const files: IMediaFile[] = useSelector(
        (storeUpdate: any) => getActiveOutput(storeUpdate)?.mediaFiles
    ) ?? []
    const hiddenFiles: Record<string, HiddenFileInfo> = useSelector(
        (storeUpdate: any) => storeUpdate.media[0].hiddenFiles
    ) ?? {}
    const isInEditVisibilityMode = useSelector(
        (storeUpdate: any) => getActiveOutput(storeUpdate)?.operationMode === OperationMode.EDIT_VISIBILITY
    ) ?? OperationMode.CONTROL
    const shownFiles: IMediaFile[] = !isInEditVisibilityMode 
        ? files.filter(({ name }) => !(name in hiddenFiles)) 
        : files
    // Render:    
        return (
            <div className="flexBoxes">
                {shownFiles?.map((file: IMediaFile, index: number) => (
                    <div className="boxComponent" key={index}>
                        {reduxState.appNav[0].selectView === 0 
                            ? <RenderThumb file={file} /> 
                            : <RenderThumbText file={file} />}
                    </div>
                ))}
            </div>
        )    
}

function handleClickMedia(fileName: string): void {    
    const operationMode = getActiveOutput(reduxState)?.operationMode
    switch (operationMode) {
        case OperationMode.EDIT_VISIBILITY: 
            toggleVisibility(fileName)
            break;
        case OperationMode.CONTROL:
        default:
            playFile(fileName)
            break
    }
}

function toggleVisibility(fileName: string) {
    if (isThumbnailWithTallyOnAnyOutput(fileName)) {
        alert('Unable to hide, as the file is in use somewhere.')
        return
    }
        
    socket.emit(TOGGLE_THUMBNAIL_VISIBILITY, reduxState.appNav[0].activeTab, fileName)
}

function playFile(fileName: string ) {
    const event = !getActiveOutput(reduxState)?.manualstartState 
        ? PGM_PLAY 
        : PGM_LOAD
    socket.emit(event, reduxState.appNav[0].activeTab, fileName)
}

const RenderThumb = (props: ThumbnailProps) => {    
    // Redux hook:
    useSelector(
        (storeUpdate: any) => getActiveOutput(storeUpdate)
                .tallyFile
    )

    const hiddenFiles: Record<string, HiddenFileInfo> = useSelector(
        (storeUpdate: any) => 
            storeUpdate.media[0].hiddenFiles
    ) ?? {}

    const classNames = [
        'thumb',
        props.file.name in hiddenFiles ? 'hidden' : ''
    ].join(' ')

    return (
        <div className={classNames}>
            <RenderThumbPix file={props.file} />
            <button
                className="thumbnailImageClickPgm"
                onClick={() => {
                    handleClickMedia(props.file.name)
                }}
            ></button>
            {isThumbWithTally(props.file.name) ? (
                <RenderThumbTimeCode file={props.file} />
            ) : (
                ''
            )}
            <p className="text">
                {props.file.name
                    .substring(props.file.name.lastIndexOf('/') + 1)
                    .slice(-45)}
            </p>
        </div>
    )
}

const RenderThumbTimeCode = (props: ThumbnailProps) => {
    // Redux hook:
    const time: [number, number] = useSelector(
        (storeUpdate: any) =>
            getActiveOutput(storeUpdate).time
    )
    const frameRate: number = useSelector(
        (storeUpdate: any) => storeUpdate.settings[0].ccgConfig
            .channels[reduxState.appNav[0].activeTab]?.videoFormat.frameRate
    )
    return (
        <a className="thumbnail-timecode">
            {isThumbWithTally(props.file.name)
                ? secondsToTimeCode(time, frameRate)
                : ''}
        </a>
    )
}

const RenderThumbPix = (props: ThumbnailProps) => {
    // Redux hook:
    const file: IMediaFile = useSelector(
        (storeUpdate: any) => getActiveOutput(storeUpdate)
            .mediaFiles.find((predicate: IMediaFile) => predicate.name === props.file.name)
    )
    useSelector((storeUpdate: any) => getActiveOutput(storeUpdate)
        .thumbnailList)
    const url = findThumbnail(file.name, reduxState.appNav[0].activeTab || 0)
    const classNames = [
        'thumbnailImage',
        isThumbWithTally(file.name) ? 'selected-thumb' : ''
    ].join(' ')

    return (
        <img src={url} className={classNames} />
    )
}

const RenderThumbText = (props: ThumbnailProps) => {
    // Redux hook:
    useSelector(
        (storeUpdate: any) => getActiveOutput(storeUpdate)
            .tallyFile
    )
    const classNames = [
        'thumbnail-text-view',
        isThumbWithTally(props.file.name) ? 'selected-thumb' : ''
    ].join(' ')

    return (
        <div className={classNames} >
            <button
                className="thumbnail-text-view-ClickPgm"
                onClick={() => {
                    handleClickMedia(props.file.name)
                }}
            ></button>
            {isThumbWithTally(props.file.name) ? (
                <RenderThumbTextTimeCode file={props.file} />
            ) : (
                ''
            )}
            <p className="text-text-view">
                {props.file.name
                    .substring(props.file.name.lastIndexOf('/') + 1)
                    .slice(-45)}
            </p>
        </div>
    )
}

const RenderThumbTextTimeCode = (props: ThumbnailProps) => {
    // Redux hook:
    const time: [number, number] = useSelector(
        (storeUpdate: any) => getActiveOutput(storeUpdate).time
    )
    const frameRate: number = useSelector(
        (storeUpdate: any) => storeUpdate.settings[0].ccgConfig
            .channels[reduxState.appNav[0].activeTab]?.videoFormat.frameRate
    )   
    
    return (
        <a className="thumbnail-timecode-text">
            {isThumbWithTally(props.file.name)
                ? secondsToTimeCode(time, frameRate)
                : ''}
        </a>
    )
}
