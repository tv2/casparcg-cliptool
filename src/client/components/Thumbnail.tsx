import React, { PureComponent } from 'react';
import '../css/Thumbnail.css';
import './App';
import { reduxStore, reduxState } from '../reducers/store'

import Sortable from 'react-sortablejs';

//Global const:
const FPS = 25;

//Redux:
import { connect } from "react-redux";

//Utils:import LoadThumbs from '../util/LoadThumbs';
//import { saveThumbsOrder } from '../util/SettingsStorage';



class Thumbnail extends PureComponent {
    //Props:
    // ccgOutputProps={item.key} what output on CCG to play at
    // ccgConnectionProps= {this.ccgConnection}
    // loadMediaProps={this.loadMedia.bind(this)}
    // loadBgMediaProps={this.loadBgMedia.bind(this)}
    // updatePlayingStatusProps={this.updatePlayingStatus.bind(this)}
    ccgOutput: any
    constructor(props: any) {
        super(props);
        this.ccgOutput = 0 // this.props.ccgOutputProps;

        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount() {
    }

    onDragEnd(order, sortable, event) {
        let { data, appNav } = reduxState;
        console.log("DRAGGED: ", event);
        reduxStore.dispatch({
            type: 'MOVE_THUMB_IN_LIST',
            data: {
                tab: appNav[0].activeTab,
                source: event.oldIndex,
                destination: event.newIndex
            }
        });

        let list = data[0].channel[this.ccgOutput-1].thumbList.map((thumb) => {
            return thumb.name;
        });
        reduxStore.dispatch({
            type:'SET_THUMB_ORDER',
            channel: this.ccgOutput,
            list: list
        });
        // saveThumbsOrder(this.props.ccgConnectionProps, data[0].thumbOrder);
        // this.props.updatePlayingStatusProps( this.ccgOutput-1);
    }

    renderThumb(item, index) {
        if (reduxState.settings[0].selectView === 0 ) {
            return (
                <div>
                    <img src={item.thumbPix}
                        className="thumbnailImage"
                        style = {Object.assign({},
                            item.tally ?
                                {borderWidth: '4px'} : {borderWidth: '0px'},
                            item.tallyBg ?
                                {boxShadow: '0px 0px 1px 5px green'} : {boxShadow: ''}
                        )}
                    />
                    <button className="thumbnailImageClickPvw"
                    />
                    <button className="thumbnailImageClickPgm"
                    />
                    <a className="thumbnail-timecode">
                        {item.tally ?
                            reduxState.data[0].ccgTimeCounter[this.ccgOutput-1]
                            : ""
                        }
                    </a>
                    <p className="text">
                        {item.name.substring(item.name.lastIndexOf('/')+1).slice(-45)}
                    </p>
                </div>
        )
        } else {
            return (
                <div className="thumbnail-text-view"
                        style = {Object.assign({},
                            item.tally ?
                                {borderWidth: '4px'} : {borderWidth: '0px'},
                            item.tallyBg ?
                                {boxShadow: '0px 0px 1px 5px green'} : {boxShadow: ''}
                        )}
                >
                    <button className="thumbnail-text-view-ClickPgm"
                    />
                    <p className="text-text-view">
                        {item.name.substring(item.name.lastIndexOf('/')+1).slice(-45)}
                    </p>
                </div>
            )
        }

    }

    render() {
        return (
            <div
                className="flexBoxes"
            >
                {reduxState.data[0].channel[this.ccgOutput-1].thumbList
                .map((item, index) => (
                    <div
                        className="boxComponent"
                        key={"item" + index}
                    >
                        { (reduxState.settings[0].selectView < 2  ) ?
                            this.renderThumb(item, index)
                            : ""
                        }
                    </div>
                ))}
            </div>

        )
    }
}


const mapStateToProps = (state) => {
    return {
        store: state
    }
}

export default connect(mapStateToProps, null, null, {forwardRef : true})(Thumbnail);
