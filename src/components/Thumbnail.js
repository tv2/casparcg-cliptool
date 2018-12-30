import React, { Component, PureComponent } from 'react';
import '../assets/css/Thumbnail.css';
import './App';
import gql from "graphql-tag";

//Global const:
const FPS = 25;

//thumb counterDown reference:
var thumbTimer;
var thumbCountTimer;

//Redux:
import { connect } from "react-redux";


class Thumbnail extends PureComponent {
    //Props:
    //ccgOutputProps what output on CCG to play at
    //ccgConnectionProps Current CCG connection
    //ccgStateConnectionProps Current CCG-state connection
    //getCcgIsUpdatedProps: returns info if a channel is updated
    //resetCcgIsUpdatedProps: resets ccgIsUpdated state to 0 (no update)
    //loadMediaProps: Loads media
    //loadBgMediaProps: Loads media in Background


    constructor(props) {
        super(props);
        this.state = {
            thumbActiveIndex: 0,
            thumbActiveBgIndex: 0,
            isTabActive: false,
        };

        this.updatePlayingStatus = this.updatePlayingStatus.bind(this);
        this.renderThumbnail = this.renderThumbnail.bind(this);
    }

    componentDidMount() {
        this.props.ccgConnectionProps.cls(this.props.store.settingsReducer[0].settings.tabData[this.props.ccgOutputProps-1].subFolder)
        .then((results) => {
            results.response.data.map((item, index) => {
                item.tally = false;
                item.tallyBg = false;
                this.props.dispatch({
                    type: 'ADD_THUMB_LIST',
                    data: {
                        tab: this.props.store.appNavReducer[0].appNav.activeTab,
                        thumbList: item
                    }
                });

                this.props.ccgConnectionProps.thumbnailRetrieve(item.name)
                .then((pixResponse) => {
                    this.props.dispatch({
                        type: 'ADD_THUMB_PIX',
                        data: {
                            tab: this.props.store.appNavReducer[0].appNav.activeTab,
                            index: index,
                            thumbPix: pixResponse.response.data
                        }
                    });
                });
            });
            this.startTimers();
        })
        .catch ((error) => {
            if (error.response.code === 404 ) {
                window.alert("Folder: " + this.props.store.settingsReducer[0].settings.tabData[this.props.ccgOutputProps-1].subFolder + " does not exist");
            }
        });
    }

    startTimers() {
        // Check tally status:
        thumbTimer = setInterval(() => {
            if (this.props.getCcgIsUpdatedProps() === this.props.ccgOutputProps) {
                this.updatePlayingStatus();
                this.props.resetCcgIsUpdatedProps();
            }
        }, 100);
    }

    updatePlayingStatus() {
            var infoStatus = this.props.store.dataReducer[0].data.ccgInfo[this.props.ccgOutputProps-1].layers[10-1];
            var fileNameFg = this.cleanUpFilename(infoStatus.foreground.name || '');
            var fileNameBg = this.cleanUpFilename(infoStatus.background.name || '');

            this.props.store.dataReducer[0].data.channel[this.props.ccgOutputProps-1].thumbList
            .map((item, index)=>{

                //Handle Foreground:
                if(fileNameFg === item.name) {
                    this.props.dispatch({
                        type: 'SET_THUMB_ACTIVE_INDEX',
                        data: {
                            tab: (this.props.ccgOutputProps - 1),
                            thumbActiveIndex: index
                        }
                    });
                }
                //Handle Background:
                if(fileNameBg === item.name) {
                    this.props.dispatch({
                        type: 'SET_THUMB_ACTIVE_BG_INDEX',
                        data: {
                            tab: (this.props.ccgOutputProps - 1),
                            thumbActiveBgIndex: index
                        }
                    });
                }
            });
    }

    cleanUpFilename(filename) {
        // casparcg-connection library bug: returns filename with media// or media/
        return (filename.replace(/\\/g, '/')
            .replace('media//', '')
            .replace('media/', '')
            .toUpperCase()
            .replace(/\..+$/, '')
        );
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

    renderThumbnail() {
        return(
            <ul className="flexBoxes" >
                {this.props.store.dataReducer[0].data.channel[this.props.ccgOutputProps-1].thumbList.map((item, index) => (
                    <li key={index} className="boxComponent">
                        <img src={this.props.store.dataReducer[0].data.channel[this.props.ccgOutputProps-1].thumbList[index].thumbPix}
                            className="thumbnailImage"
                            style = {Object.assign({},
                                this.props.store.dataReducer[0].data.channel[this.props.ccgOutputProps-1].thumbList[index].tally ?
                                    {borderWidth: '4px'} : {borderWidth: '0px'},
                                this.props.store.dataReducer[0].data.channel[this.props.ccgOutputProps-1].thumbList[index].tallyBg ?
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
                            {this.props.store.dataReducer[0].data.channel[this.props.ccgOutputProps-1].thumbList[index].tally ?
                                this.secondsToTimeCode(this.props.store.dataReducer[0].data.ccgTimeLeft[this.props.ccgOutputProps-1].timeLeft)
                                : ""
                            }
                        </a>
                        <p className="text">
                            {this.props.store.dataReducer[0].data.channel[this.props.ccgOutputProps-1].thumbList[index].name.substring(this.props.store.dataReducer[0].data.channel[this.props.ccgOutputProps-1].thumbList[index].name.lastIndexOf('/')+1).slice(-45)}
                        </p>
                    </li>
                ))}
            </ul>
        )
    }

    render() {
        return (
        <div className="Thumb-body">
            <this.renderThumbnail/>
        </div>
    )}

}


const mapStateToProps = (state) => {
    return {
        store: state
    }
}

export default connect(mapStateToProps, null, null, {forwardRef : true})(Thumbnail);
