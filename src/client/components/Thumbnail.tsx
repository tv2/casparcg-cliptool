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
import { shallowEqual, useSelector } from 'react-redux'

export const getThumb = (fileName: string, channelIndex: number) => {
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
    const store = useSelector((store) => store, shallowEqual)

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

    const renderThumb = (item: IMediaFile, index) => {
        return (
            <div>
                <img
                    src={getThumb(
                        item.name,
                        reduxState.appNav[0].activeTab || 0
                    )}
                    className="thumbnailImage"
                    style={Object.assign(
                        {},
                        reduxState.media[0].output[
                            reduxState.appNav[0].activeTab
                        ]?.tallyFile === item.name
                            ? { borderWidth: '4px' }
                            : { borderWidth: '0px' }
                    )}
                />
                <button
                    className="thumbnailImageClickPgm"
                    onClick={() => {
                        handleClickMedia(item.name)
                    }}
                ></button>
                <a className="thumbnail-timecode">
                    {reduxState.media[0].output[reduxState.appNav[0].activeTab]
                        .tallyFile === item.name
                        ? secondsToTimeCode(
                              reduxState.media[0].output[
                                  reduxState.appNav[0].activeTab
                              ]?.time
                          )
                        : ''}
                </a>
                <p className="text">
                    {item.name
                        .substring(item.name.lastIndexOf('/') + 1)
                        .slice(-45)}
                </p>
            </div>
        )
    }

    const renderThumbText = (item: IMediaFile, index) => {
        return (
            <div
                className="thumbnail-text-view"
                style={Object.assign(
                    {},
                    reduxState.media[0].output[reduxState.appNav[0].activeTab]
                        ?.tallyFile === item.name
                        ? { borderWidth: '4px' }
                        : { borderWidth: '0px' }
                )}
            >
                <button
                    className="thumbnail-text-view-ClickPgm"
                    onClick={() => {
                        handleClickMedia(item.name)
                    }}
                ></button>
                <p className="text-text-view">
                    {item.name
                        .substring(item.name.lastIndexOf('/') + 1)
                        .slice(-45)}
                </p>
            </div>
        )
    }

    // Render:
    if (reduxState.appNav[0].selectView === 0) {
        return (
            <div className="flexBoxes">
                {reduxState.media[0].output[
                    reduxState.appNav[0].activeTab
                ]?.mediaFiles.map((item: IMediaFile, index: number) => (
                    <div className="boxComponent" key={'item' + index}>
                        {renderThumb(item, index)}
                    </div>
                ))}
            </div>
        )
    } else {
        return (
            <div className="flexBoxesText">
                {reduxState.media[0].output[
                    reduxState.appNav[0].activeTab
                ]?.mediaFiles.map((item: IMediaFile, index: number) => (
                    <div className="boxComponent" key={'item' + index}>
                        {renderThumbText(item, index)}
                    </div>
                ))}
            </div>
        )
    }
}
