import React, { PureComponent } from 'react';
import '../assets/css/Thumbnail.css';
import './App';

import Sortable from 'react-sortablejs';
import gql from "graphql-tag";

//Global const:
const FPS = 25;

//Redux:
import { connect } from "react-redux";

//Utils:
import {cleanUpFilename, extractFilenameFromPath} from '../util/filePathStringHandling';


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
        this.ccgMediaFilesChanges = this.ccgMediaFilesChanged.bind(this);
    }

    componentDidMount() {
        this.loadThumbs();
        this.ccgMediaFilesChanged();
    }


    ccgMediaFilesChanged() {
        var _this2 = this;
        //Subscribe to CasparCG-State changes:
        window.__APOLLO_CLIENT__.subscribe({
            query: gql`
                subscription {
                    mediaFilesChanged
                }`
        })
        .subscribe({
            next(response) {
                console.log("Media Files Changed");
                _this2.loadThumbs();
            },
            error(err) { console.error('Subscription error: ', err); },
        });
    }


    loadThumbs() {
        this.props.ccgConnectionProps.cls(this.props.store.settingsReducer[0].settings.tabData[this.props.ccgOutputProps-1].subFolder)
        .then((results) => {
            let items = results.response.data.filter((item) => {
                return item.type === 'video';
            });
            if (items.length === 0) return false;
            this.props.dispatch({
                type: 'SET_THUMB_LENGTH',
                data: {
                    tab: this.props.ccgOutputProps-1,
                    length: items.length
                }
            });
            items.map((item, index) => {
                var currentAtIndex = this.props.store.dataReducer[0].data.channel[this.props.ccgOutputProps-1].thumbList[index] | { name: ''};
                if (item.name != currentAtIndex)
                    {
                    item.tally = false;
                    item.tallyBg = false;
                    this.props.dispatch({
                        type: 'SET_THUMB_LIST',
                        data: {
                            tab: this.props.ccgOutputProps-1,
                            index: index,
                            thumbList: item
                        }
                    });

                    console.log("MetaFileName: ", item.name +
                    ".meta");

                    this.props.ccgConnectionProps.dataRetrieve(item.name + ".meta")
                    .then((data) => {
                        window.store.dispatch({
                            type:'SET_META_LIST',
                            index: index,
                            tab: this.props.ccgOutputProps-1,
                            metaList: JSON.parse(data.response.data).channel[this.props.ccgOutputProps-1].metaList
                        });
                    })
                    .catch((error) => {
                        window.store.dispatch({
                            type:'SET_META_LIST',
                            index: index,
                            tab: this.props.ccgOutputProps-1,
                            metaList: [{
                                templatePath: '',
                                startTime: 0,
                                duration: 0,
                                templateData: [{
                                    id: '',
                                    type: '',
                                    data: ''
                                }]
                            }]
                        });
                    });

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
                }
            });
            this.props.updatePlayingStatusProps(this.props.ccgOutputProps-1);
            console.log("Channel: ", this.props.ccgOutputProps, " loaded");
        })
        .catch ((error) => {
            console.log("Error :" , error);
            if (error.response.code === 404 ) {
                window.alert("Folder: " + this.props.store.settingsReducer[0].settings.tabData[this.props.ccgOutputProps-1].subFolder + " does not exist");
            }
        });
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
                        this.props.store.dataReducer[0].data.ccgTimeCounter[this.props.ccgOutputProps-1]
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
