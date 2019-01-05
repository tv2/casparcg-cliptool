import React, { PureComponent } from 'react';
import '../assets/css/Thumbnail.css';
import './App';

import Sortable from 'react-sortablejs';

//Global const:
const FPS = 25;

//Redux:
import { connect } from "react-redux";


class Thumbnail extends PureComponent {
    //Props:
    // ccgOutputProps={item.key} what output on CCG to play at
    // ccgConnectionProps={this.ccgConnection} Current CCG connection object
    // loadMediaProps={this.loadMedia.bind(this)}
    // loadBgMediaProps={this.loadBgMedia.bind(this)}
    // updatePlayingStatusProps={this.updatePlayingStatus.bind(this)}

    constructor(props) {
        super(props);
        this.loadThumbs = this.loadThumbs.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount() {
        this.loadThumbs();
    }

    loadThumbs() {
        this.props.ccgConnectionProps.cls(this.props.store.settingsReducer[0].settings.tabData[this.props.ccgOutputProps-1].subFolder)
        .then((results) => {
            var items = results.response.data.filter((item) => {
                return item.type === 'video';
            });
            items.map((item, index) => {
                item.tally = false;
                item.tallyBg = false;
                if (index === 0) {
                    this.props.dispatch({
                        type: 'SET_THUMB_LIST',
                        data: {
                            tab: this.props.ccgOutputProps-1,
                            thumbList: item
                        }
                    });
                } else {
                    this.props.dispatch({
                        type: 'ADD_THUMB_LIST',
                        data: {
                            tab: this.props.ccgOutputProps-1,
                            thumbList: item
                        }
                    });
                }

                this.props.ccgConnectionProps.thumbnailRetrieve(item.name)
                .then((pixResponse) => {
                    this.props.dispatch({
                        type: 'SET_THUMB_PIX',
                        data: {
                            tab: this.props.ccgOutputProps-1,
                            index: index,
                            thumbPix: pixResponse.response.data
                        }
                    });
                });
            });
            this.props.updatePlayingStatusProps(this.props.ccgOutputProps-1);
            console.log("Channel: ", this.props.ccgOutputProps, " loaded");
        })
        .catch ((error) => {
            if (error.response.code === 404 ) {
                window.alert("Folder: " + this.props.store.settingsReducer[0].settings.tabData[this.props.ccgOutputProps-1].subFolder + " does not exist");
            }
        });
    }

    secondsToTimeCode(time) {
        if (time) {
            var hour = ('0' + (time/(60*60)).toFixed()).slice(-2);
            var minute = ('0' + (time/(60)).toFixed()).slice(-2);
            var sec = ('0' + time.toFixed()).slice(-2);
            var frm = ('0' + (100*(time - parseInt(time))*(FPS/100)).toFixed()).slice(-2);
        return (
            hour + "." + minute + "." + sec + "." + frm
        );
        } else {
            return "00.00.00.00";
        }
    }

    onDragEnd(order, sortable, evt) {
        console.log("DRAGGED: ", evt);
        this.props.dispatch({
            type: 'MOVE_THUMB_IN_LIST',
            data: {
                tab: this.props.store.appNavReducer[0].appNav.activeTab,
                source: evt.oldIndex,
                destination: evt.newIndex
            }
        });
    this.props.updatePlayingStatusProps(this.props.ccgOutputProps-1);
    // the only one that is required
    }

    renderThumb(item, index) {
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
                    onClick={() => this.props.loadBgMediaProps(this.props.ccgOutputProps, 10, index)}
                />
                <button className="thumbnailImageClickPgm"
                    onClick={() => this.props.loadMediaProps(this.props.ccgOutputProps, 10, index)}
                />
                <a className="playing">
                    {item.tally ?
                        this.secondsToTimeCode(this.props.store.dataReducer[0].data.ccgTimeLeft[this.props.ccgOutputProps-1].timeLeft)
                        : ""
                    }
                </a>
                <p className="text">
                    {item.name.substring(item.name.lastIndexOf('/')+1).slice(-45)}
                </p>
            </div>
        )

    }

    render() {
        return (
            <Sortable
                className="flexBoxes"
                onChange={(order, sortable, evt) => {
                    this.onDragEnd(order, sortable, evt);
                }}
            >
                {this.props.store.dataReducer[0].data.channel[this.props.ccgOutputProps-1].thumbList
                .map((item, index) => (
                    <div
                        className="boxComponent"
                        key={"item" + index}
                    >
                        { this.renderThumb(item, index) }
                    </div>
                ))}
            </Sortable>

        )
    }
}


const mapStateToProps = (state) => {
    return {
        store: state
    }
}

export default connect(mapStateToProps, null, null, {forwardRef : true})(Thumbnail);
