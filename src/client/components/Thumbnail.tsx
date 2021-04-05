import React, { PureComponent } from 'react'
import '../css/Thumbnail.css'
import './App'
import { reduxState } from '../../model/reducers/store'
import { secondsToTimeCode } from '../util/TimeCodeToString'

//Global const:
const FPS = 25

//Redux:
import { connect } from 'react-redux'
import { IMediaFile, IThumbFile } from '../../model/reducers/mediaReducer'
class Thumbnail extends PureComponent {
    ccgOutput: any
    constructor(props: any) {
        super(props)
        this.ccgOutput = 0 // this.props.ccgOutputProps;

    }

    componentDidMount() {}

    getThumb = (fileName: string) => {
        let thumb = reduxState.media[0].thumbnailList.filter((item: IThumbFile) => {
            return item.name === fileName
        })
        return thumb[0]?.thumbnail || ''
    }

    renderThumb(item: IMediaFile, index) {
        if (reduxState.settings[0].selectView === 0) {
            return (
                <div>
                    <img
                        src={this.getThumb(item.name)}
                        className="thumbnailImage"
                        style={Object.assign(
                            {},
                            reduxState.media[0].tallyFile[0] ===
                        item.name
                                ? { borderWidth: '4px' }
                                : { borderWidth: '0px' }
                        )}
                    />
                    <button className="thumbnailImageClickPvw" />
                    <button className="thumbnailImageClickPgm" />
                    <a className="thumbnail-timecode">
                        {reduxState.media[0].tallyFile[0] ===
                        item.name
                            ? secondsToTimeCode(
                                  reduxState.channels[0][0]?.layer[9]
                                      ?.foreground?.file?.time[0]
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
                        reduxState.media[0].tallyFile[0] ===
                        item.name ? { borderWidth: '4px' } : { borderWidth: '0px' }
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

    render() {
        return (
            <div className="flexBoxes">
                {reduxState.media[0].mediaFiles.map(
                    (item: IMediaFile, index: number) => (
                        <div className="boxComponent" key={'item' + index}>
                            {reduxState.settings[0].selectView < 2
                                ? this.renderThumb(item, index)
                                : ''}
                        </div>
                    )
                )}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        store: state,
    }
}

export default connect(mapStateToProps, null, null, { forwardRef: true })(
    Thumbnail
)
