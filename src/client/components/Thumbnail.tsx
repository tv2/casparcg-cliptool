import React from 'react'
import '../css/Thumbnail.css'
import './App'
import { reduxState } from '../../model/reducers/store'
import { secondsToTimeCode } from '../util/TimeCodeToString'

//Redux:
import { IHiddenFileInfo, IMediaFile, IThumbFile, OperationMode } from '../../model/reducers/mediaReducer'
import { socket } from '../util/SocketClientHandlers'
import { PGM_LOAD, PGM_PLAY, TOGGLE_THUMBNAIL_VISIBILITY } from '../../model/SocketIoConstants'
import { useSelector } from 'react-redux'

interface ThumbnailProps {
    file: IMediaFile
}

export const findThumbPix = (fileName: string, channelIndex: number) => {
    const thumb =
        reduxState.media[0].output[channelIndex]?.thumbnailList.find(
            (item: IThumbFile) => item.name.toUpperCase() === (fileName.toUpperCase())
        )
    return thumb?.thumbnail ?? ''
}

export const isThumbWithTally = (thumbName: string): boolean => {
    // convert to uppercase, handle windows double slash + backslash and remove file extension:
    const tallyFileName = reduxState.media[0].output[
        reduxState.appNav[0].activeTab
    ].tallyFile
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

    return tallyNoMediaPath === thumbName
}

export const Thumbnail = () => {
    // Redux hook:
    const files: IMediaFile[] = useSelector(
        (storeUpdate: any) =>
            storeUpdate.media[0].output[reduxState.appNav[0].activeTab]
                ?.mediaFiles
    )
    const hiddenFiles: Record<string, IHiddenFileInfo> = useSelector(
        (storeUpdate: any) => storeUpdate.media[0].hiddenFiles
    )
    const editVisibilityMode = useSelector(
        (storeUpdate: any) =>
            storeUpdate.media[0].output[reduxState.appNav[0].activeTab].operationMode === OperationMode.EDIT_VISIBILITY
    )
    const shownFiles: IMediaFile[] = files.filter(({ name }) => !(name in hiddenFiles))
    const usedFiles: IMediaFile[] = editVisibilityMode ? files : shownFiles
    // Render:    
        return (
            <div className="flexBoxes">
                {usedFiles.map((file: IMediaFile, index: number) => (
                    <div className="boxComponent" key={index}>
                        {reduxState.appNav[0].selectView === 0 
                            ? <RenderThumb file={file} /> 
                            : <RenderThumbText file={file} />}
                    </div>
                ))}
            </div>
        )    
}

const handleClickMedia = (fileName: string) => {    
    const operationMode = reduxState.media[0].output[reduxState.appNav[0].activeTab]?.operationMode
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
    if (isThumbWithTally(fileName))
        return
    socket.emit(TOGGLE_THUMBNAIL_VISIBILITY, reduxState.appNav[0].activeTab, fileName)
}

function playFile(fileName: string ) {
    const event = !reduxState.media[0].output[reduxState.appNav[0].activeTab]?.manualstartState 
        ? PGM_PLAY 
        : PGM_LOAD
    socket.emit(event, reduxState.appNav[0].activeTab, fileName)
}

const RenderThumb = (props: ThumbnailProps) => {    
    // Redux hook:
    useSelector(
        (storeUpdate: any) =>
            storeUpdate.media[0].output[reduxState.appNav[0].activeTab]
                .tallyFile
    )

    return (
        <div>
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
            storeUpdate.media[0].output[reduxState.appNav[0].activeTab].time
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
        (storeUpdate: any) =>
            storeUpdate.media[0].output[reduxState.appNav[0].activeTab]
                .mediaFiles.find((predicate: IMediaFile) => predicate.name === props.file.name)
    )

    useSelector((storeUpdate: any) => storeUpdate.media[0].output[reduxState.appNav[0].activeTab]
        .thumbnailList)

    const hiddenFiles: Record<string, IHiddenFileInfo> = useSelector(
        (storeUpdate: any) => 
            storeUpdate.media[0].hiddenFiles
    )
    const url = findThumbPix(file.name, reduxState.appNav[0].activeTab || 0)
    return (
        <img
            src={url}
            className="thumbnailImage"
            style={{
                ...borderStyle(file.name),
                filter: file.name in hiddenFiles
                    ? 'grayscale(1)' 
                    : 'grayscale(0)'
            }}
        />
    )
}

function borderStyle(filepath: string) {
    return Object.assign(
        {},
        isThumbWithTally(filepath)
            ? { borderWidth: '4px' }
            : { borderWidth: '0px' }
    )
}

const RenderThumbText = (props: ThumbnailProps) => {
    // Redux hook:
    useSelector(
        (storeUpdate: any) =>
            storeUpdate.media[0].output[reduxState.appNav[0].activeTab]
                .tallyFile
    )
    return (
        <div
            className="thumbnail-text-view"
            style={borderStyle(props.file.name)}
        >
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
        (storeUpdate: any) =>
            storeUpdate.media[0].output[reduxState.appNav[0].activeTab].time
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
