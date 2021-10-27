import React from 'react'
import '../css/Thumbnail.css'
import './App'
import { reduxState } from '../../model/reducers/store'
import { secondsToTimeCode } from '../util/TimeCodeToString'

//Global const:
const FPS = 25

//Redux:
import { IMediaFile, IThumbFile } from '../../model/reducers/mediaReducer'
import { socket } from '../util/SocketClientHandlers'
import { PGM_LOAD, PGM_PLAY } from '../../model/SocketIoConstants'
import { useSelector } from 'react-redux'

export const findThumbPix = (fileName: string, channelIndex: number) => {
    let thumb =
        reduxState.media[0].output[channelIndex]?.thumbnailList.filter(
            (item: IThumbFile) => {
                return item.name === fileName
            }
        ) || []
    return thumb[0]?.thumbnail || ''
}

export const Thumbnail = () => {
    // Redux hook:
    useSelector(
        (storeUpdate: any) =>
            storeUpdate.media[0].output[reduxState.appNav[0].activeTab]
                ?.mediaFiles
    )

    // Render:
    if (reduxState.appNav[0].selectView === 0) {
        return (
            <div className="flexBoxes">
                {reduxState.media[0].output[
                    reduxState.appNav[0].activeTab
                ]?.mediaFiles.map((item: IMediaFile, index: number) => (
                    <div className="boxComponent" key={index}>
                        <RenderThumb item={item} />
                    </div>
                ))}
            </div>
        )
    } else {
        return (
            <div className="flexBoxes">
                {reduxState.media[0].output[
                    reduxState.appNav[0].activeTab
                ]?.mediaFiles.map((item: IMediaFile, index: number) => (
                    <div className="boxComponentText" key={index}>
                        <RenderThumbText item={item} />
                    </div>
                ))}
            </div>
        )
    }
}

const handleClickMedia = (fileName: string) => {
    if (
        !reduxState.media[0].output[reduxState.appNav[0].activeTab]
            ?.manualstartState
    ) {
        socket.emit(PGM_PLAY, reduxState.appNav[0].activeTab, fileName)
    } else {
        socket.emit(PGM_LOAD, reduxState.appNav[0].activeTab, fileName)
    }
}

const RenderThumb = (props) => {
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
            {reduxState.media[0].output[reduxState.appNav[0].activeTab]
                .tallyFile.toUpperCase().includes(props.item.name) ? (
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

const RenderThumbTimeCode = (props) => {
    // Redux hook:
    useSelector(
        (storeUpdate: any) =>
            storeUpdate.media[0].output[reduxState.appNav[0].activeTab].time
    )
    return (
        <a className="thumbnail-timecode">
            {reduxState.media[0].output[reduxState.appNav[0].activeTab]
                .tallyFile.toUpperCase().includes(props.item.name)
                ? secondsToTimeCode(
                      reduxState.media[0].output[reduxState.appNav[0].activeTab]
                          ?.time
                  )
                : ''}
        </a>
    )
}

const RenderThumbPix = (props) => {
    // Redux hook:
    useSelector(
        (storeUpdate: any) =>
            storeUpdate.media[0].output[reduxState.appNav[0].activeTab]
                .thumbnailList
    )
    return (
        <img
            src={findThumbPix(
                props.item.name,
                reduxState.appNav[0].activeTab || 0
            )}
            className="thumbnailImage"
            style={Object.assign(
                {},
                reduxState.media[0].output[reduxState.appNav[0].activeTab]
                ?.tallyFile.toUpperCase().includes(props.item.name)
                    ? { borderWidth: '4px' }
                    : { borderWidth: '0px' }
            )}
        />
    )
}

const RenderThumbText = (props) => {
    // Redux hook:
    useSelector(
        (storeUpdate: any) =>
            storeUpdate.media[0].output[reduxState.appNav[0].activeTab]
                .tallyFile
    )
    return (
        <div
            className="thumbnail-text-view"
            style={Object.assign(
                {},
                reduxState.media[0].output[reduxState.appNav[0].activeTab]
                ?.tallyFile.toUpperCase().includes(props.item.name)
                    ? { borderWidth: '4px' }
                    : { borderWidth: '0px' }
            )}
        >
            <button
                className="thumbnail-text-view-ClickPgm"
                onClick={() => {
                    handleClickMedia(props.item.name)
                }}
            ></button>
            {reduxState.media[0].output[reduxState.appNav[0].activeTab]
                ?.tallyFile.toUpperCase().includes(props.item.name) ? (
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

const RenderThumbTextTimeCode = (props) => {
    // Redux hook:
    useSelector(
        (storeUpdate: any) =>
            storeUpdate.media[0].output[reduxState.appNav[0].activeTab].time
    )
    return (
        <a className="thumbnail-timecode-text">
            {reduxState.media[0].output[reduxState.appNav[0].activeTab]
                ?.tallyFile.toUpperCase().includes(props.item.name)
                ? secondsToTimeCode(
                      reduxState.media[0].output[reduxState.appNav[0].activeTab]
                          ?.time
                  )
                : ''}
        </a>
    )
}
