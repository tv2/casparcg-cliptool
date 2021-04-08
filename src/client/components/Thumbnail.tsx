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
import { PGM_PLAY } from '../../model/SocketIoConstants'

export const getThumb = (fileName: string) => {
    let thumb = reduxState.media[0].thumbnailList.filter(
        (item: IThumbFile) => {
            return item.name === fileName
        }
    )
    return thumb[0]?.thumbnail || ''
}

export const Thumbnail = () => {
    let ccgOutput = 0 // this.props.ccgOutputProps;

    const renderThumb = (item: IMediaFile, index) => {
        if (reduxState.appNav[0].selectView === 0) {
            return (
                <div>
                    <img
                        src={getThumb(item.name)}
                        className="thumbnailImage"
                        style={Object.assign(
                            {},
                            reduxState.media[0].tallyFile[0] === item.name
                                ? { borderWidth: '4px' }
                                : { borderWidth: '0px' }
                        )}
                    />
                    <button
                        className="thumbnailImageClickPgm"
                        onClick={() => {
                            socket.emit(
                                PGM_PLAY,
                                reduxState.appNav[0].activeTab,
                                item.name
                            )
                        }}
                    ></button>
                    <a className="thumbnail-timecode">
                        {reduxState.media[0].tallyFile[0] === item.name
                            ? secondsToTimeCode(
                                  reduxState.media[0].time[0]
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
        } else {
            return (
                <div
                    className="thumbnail-text-view"
                    style={Object.assign(
                        {},
                        reduxState.media[0].tallyFile[0] === item.name
                            ? { borderWidth: '4px' }
                            : { borderWidth: '0px' }
                    )}
                >
                    <button className="thumbnail-text-view-ClickPgm" />
                    <p className="text-text-view">
                        {item.name
                            .substring(item.name.lastIndexOf('/') + 1)
                            .slice(-45)}
                    </p>
                </div>
            )
        }
    }

    return (
        <div className="flexBoxes">
            {reduxState.media[0].mediaFiles.map(
                (item: IMediaFile, index: number) => (
                    <div className="boxComponent" key={'item' + index}>
                        {renderThumb(item, index)}
                    </div>
                )
            )}
        </div>
    )
}
