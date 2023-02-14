import React from 'react'
import '../css/Thumbnail.css'
import './App'
import { reduxState, reduxStore } from '../../model/reducers/store'
import { secondsToTimeCode } from '../util/TimeCodeToString'

//Redux:
import { IChangedInfo, IMediaFile, IThumbFile } from '../../model/reducers/mediaReducer'
import { socket } from '../util/SocketClientHandlers'
import { PGM_LOAD, PGM_PLAY, TOGGLE_THUMBNAIL_VISIBILITY } from '../../model/SocketIoConstants'
import { useSelector } from 'react-redux'

export const findThumbPix = (fileName: string, channelIndex: number) => {
    let thumb =
        reduxState.media[0].output[channelIndex]?.thumbnailList.filter(
            (item: IThumbFile) => item.name.toUpperCase() === (fileName.toUpperCase())
        ) || []
    return thumb[0]?.thumbnail || ''
}

export const isThumbWithTally = (thumbName): boolean => {
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
    const hiddenFiles: Record<string, IChangedInfo> = useSelector(
        (storeUpdate: any) => 
            storeUpdate.media[0].hiddenFiles
    )
    const visibilityState = useSelector(
        (storeUpdate: any) =>
            storeUpdate.media[0].output[reduxState.appNav[0].activeTab].visibilityState
    )
    const shownFiles: IMediaFile[] = files.filter(({ name }) => !(name in hiddenFiles))
    const usedFiles: IMediaFile[] = visibilityState ? files : shownFiles
    // Render:    
        return (
            <div className="flexBoxes">
                {usedFiles.map((item: IMediaFile, index: number) => (
                    <div className="boxComponent" key={index}>
                        {reduxState.appNav[0].selectView === 0 
                            ? <RenderThumb item={item} /> 
                            : <RenderThumbText item={item} />}
                    </div>
                ))}
            </div>
        )    
}

const handleClickMedia = (fileName: string) => {    
    const isTogglingVisibility = reduxState.media[0].output[reduxState.appNav[0].activeTab]?.visibilityState
    const onClickAction = isTogglingVisibility 
        ? onClickToggleVisibility 
        : onClickPlayClicked

    onClickAction(fileName)
}

function onClickToggleVisibility(fileName: string) {
    socket.emit(TOGGLE_THUMBNAIL_VISIBILITY, reduxState.appNav[0].activeTab, fileName)
}

function onClickPlayClicked(fileName: string ) {
    const event = !reduxState.media[0].output[reduxState.appNav[0].activeTab]?.manualstartState 
        ? PGM_PLAY 
        : PGM_LOAD
    socket.emit(event, reduxState.appNav[0].activeTab, fileName)
}

const RenderThumb = (props: {item: IMediaFile}) => {
    
    // Redux hook:
    useSelector(
        (storeUpdate: any) =>
            storeUpdate.media[0].output[reduxState.appNav[0].activeTab]
                .tallyFile
    )

    return (
        <div>
            <RenderThumbPix item={props.item} />
            <button
                className="thumbnailImageClickPgm"
                onClick={() => {
                    handleClickMedia(props.item.name)
                }}
            ></button>
            {isThumbWithTally(props.item.name) ? (
                <RenderThumbTimeCode item={props.item} />
            ) : (
                ''
            )}
            <p className="text">
                {props.item.name
                    .substring(props.item.name.lastIndexOf('/') + 1)
                    .slice(-45)}
            </p>
        </div>
    )
}

const RenderThumbTimeCode = (props: {item: IMediaFile}) => {
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
            {isThumbWithTally(props.item.name)
                ? secondsToTimeCode(time, frameRate)
                : ''}
        </a>
    )
}

const RenderThumbPix = (props: {item: IMediaFile}) => {
    // Redux hook:
    useSelector(
        (storeUpdate: any) =>
            storeUpdate.media[0].output[reduxState.appNav[0].activeTab]
                .thumbnailList
    )

    const hiddenFiles: Record<string, IChangedInfo> = useSelector(
        (storeUpdate: any) => 
            storeUpdate.media[0].hiddenFiles
    )
    return (
        <img
            src={findThumbPix(
                props.item.name,
                reduxState.appNav[0].activeTab || 0
            )}
            className="thumbnailImage"
            style={{
                ...borderStyle(props.item.name),
                filter: props.item.name in hiddenFiles
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

const RenderThumbText = (props: {item: IMediaFile}) => {
    // Redux hook:
    useSelector(
        (storeUpdate: any) =>
            storeUpdate.media[0].output[reduxState.appNav[0].activeTab]
                .tallyFile
    )
    return (
        <div
            className="thumbnail-text-view"
            style={borderStyle(props.item.name)}
        >
            <button
                className="thumbnail-text-view-ClickPgm"
                onClick={() => {
                    handleClickMedia(props.item.name)
                }}
            ></button>
            {isThumbWithTally(props.item.name) ? (
                <RenderThumbTextTimeCode item={props.item} />
            ) : (
                ''
            )}
            <p className="text-text-view">
                {props.item.name
                    .substring(props.item.name.lastIndexOf('/') + 1)
                    .slice(-45)}
            </p>
        </div>
    )
}

const RenderThumbTextTimeCode = (props: {item: IMediaFile}) => {
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
            {isThumbWithTally(props.item.name)
                ? secondsToTimeCode(time, frameRate)
                : ''}
        </a>
    )
}
