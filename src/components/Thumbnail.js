import React, { Component, PureComponent } from 'react';
import '../assets/css/Thumbnail.css';
import './App';
import gql from "graphql-tag";

//Global const:
const FPS = 25;
const MIX_DURATION = 6;

//thumb counterDown reference:
var thumbTimer;
var thumbCountTimer;



class Thumbnail extends PureComponent {
    //Props:
    //ccgOutputProps what output on CCG to play at
    //ccgConnectionProps Current CCG connection
    //ccgStateConnectionProps Current CCG-state connection
    //getCcgIsUpdatedProps: returns info if a channel is updated
    //getCcgInfoDataProps: returns object with all channels and all layers
    //getTimeLeftProps: returns timeleft for channel
    //resetCcgIsUpdatedProps: resets ccgIsUpdated state to 0 (no update)
    //setActivePgmPixProps Reference to Set Header PGMpix
    //setActivePvmPixProps Reference to Set Header Pvmpix
    //setPgmCounterProps Sets the timer in header
    //getTabStateProps returns TRUE/FALSE Is this tab loaded
    //getTabSettingsProps return the setting parameter from argument

    constructor(props) {
        super(props);
        this.state = {
            thumbListRendered: [],
            thumbActiveIndex: 0,
            thumbActiveBgIndex: 0,
            isTabActive: false,
        };
        this.thumbList = [];

        this.updatePlayingStatus = this.updatePlayingStatus.bind(this);
        this.updateTimerStatus = this.updateTimerStatus.bind(this);
        this.updateThumbnail = this.updateThumbnail.bind(this);
        this.renderThumbnail = this.renderThumbnail.bind(this);

        this.loadMedia = this.loadMedia.bind(this);
        this.loadBgMedia = this.loadBgMedia.bind(this);
    }

    componentWillMount() {
        document.addEventListener("keydown", this._handleKeyDown.bind(this));
    }

    componentDidMount() {
        this.props.ccgConnectionProps.cls(this.props.getTabSettingsProps(this.props.ccgOutputProps,'subFolder'))
        .then((results) => {
            results.response.data.map((item, index) => {
                item.tally = false;
                item.tallyBg = false;
                item.timeLeft = 0;
                this.thumbList.push(item);

                this.props.ccgConnectionProps.thumbnailRetrieve(item.name)
                .then((pixResponse) => {
                    this.thumbList[index].thumbPix = pixResponse.response.data;
                    this.updateThumbnail(index);
                });
            });
            this.startTimers();
        })
        .catch ((error) => {
            if (error.response.code === 404 ) {
                window.alert("Folder: " + this.props.getTabSettingsProps(this.props.ccgOutputProps, 'subFolder') + " does not exist");
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

        // Update TimeCodes:
        thumbCountTimer = setInterval(() => {
            this.updateTimerStatus();
        }, 40);
    }

    //Shortcut for mix and take
    _handleKeyDown(event) {
        //Play PVW 1-4 key 1-4:
        const pvwPlay = JSON.stringify(this.props.ccgOutputProps).charCodeAt(0);
        //Play PGM 1-4 key: QWER:
        const pgmPlay = ["Q", "W", "E", "R"][this.props.ccgOutputProps-1].charCodeAt(0);

        switch( event.keyCode ) {
            case pvwPlay:
                this.playMedia(
                    10,
                    this.state.thumbActiveBgIndex,
                    this.state.thumbActiveIndex
                );
                break;
            case pgmPlay:
                this.playMedia(
                    10,
                    this.state.thumbActiveIndex,
                    this.state.thumbActiveBgIndex
                );
                break;
            default:
                break;
        }
    }

    updatePlayingStatus() {
            var infoStatus = this.props.getCcgInfoDataProps()[this.props.ccgOutputProps-1].layers[10-1];
            var fileNameFg = this.cleanUpFilename(infoStatus.foreground.name || '');
            var fileNameBg = this.cleanUpFilename(infoStatus.background.name || '');

            this.thumbList.map((item, index)=>{
                this.thumbList[index].tally = false;
                if (fileNameBg != "") {
                    this.thumbList[index].tallyBg = false;
                }
                //Handle Foreground:
                if(fileNameFg === item.name) {
                    this.thumbList[index].tally = true;
                    this.setState({thumbActiveIndex: index});
                    this.thumbList[index].loop = infoStatus.foreground.loop;
                }
                //Handle Background:
                if(fileNameBg === item.name) {
                    this.thumbList[index].tallyBg = true;
                    this.setState({thumbActiveBgIndex: index});
                }
                this.updateThumbnail(index);
            });
    }

    updateThumbnail(index) {
        if (this.thumbList[index].tally) {
            this.props.setActivePgmPixProps(this.thumbList[index].thumbPix);
        }
        if (this.thumbList[index].tallyBg) {
            this.props.setActivePvwPixProps(this.thumbList[index].thumbPix);
        }
        var prevStateList = this.state.thumbListRendered;
        prevStateList[index] = this.renderThumbnail(index);
        this.setState({thumbListRendered: prevStateList});
    }

    updateTimerStatus() {
        //Check for active state, and update state if it becomes active or in-active
        if (this.state.isTabActive != this.props.getTabStateProps(this.props.ccgOutputProps)) {
            if (!this.state.isTabActive ) this.updatePlayingStatus();
            this.setState({isTabActive: this.props.getTabStateProps(this.props.ccgOutputProps)});
        }

        //only update timer when tab is selected:
        if (this.state.isTabActive) {
                this.thumbList[this.state.thumbActiveIndex].timeLeft = this.props.getTimeLeftProps(this.props.ccgOutputProps);
                this.updateThumbnail(this.state.thumbActiveIndex);
                this.props.setPgmCounterProps(this.secondsToTimeCode( this.thumbList[this.state.thumbActiveIndex].timeLeft));
        }
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

    pvwPlay() {
        this.playMedia(10, this.state.thumbActiveBgIndex, this.state.thumbActiveIndex);
    }

    pgmPlay() {
        this.playMedia(10, this.state.thumbActiveIndex, this.state.thumbActiveBgIndex);
    }

    playMedia(layer, index, indexBg) {
        this.props.ccgConnectionProps.play(
            this.props.ccgOutputProps,
            layer,
            this.thumbList[index].name,
            this.props.getTabSettingsProps(this.props.ccgOutputProps, "loop"),
            'MIX',
            MIX_DURATION
        );
        this.loadBgMedia(10, indexBg);
    }

    loadMedia(layer, index) {
        if (this.props.getTabSettingsProps(this.props.ccgOutputProps, "autoPlay")) {
            this.playMedia(10, index, this.state.thumbActiveBgIndex);
        } else {
            this.props.ccgConnectionProps.load(
                this.props.ccgOutputProps,
                layer,
                this.thumbList[index].name,
                this.props.getTabSettingsProps(this.props.ccgOutputProps, "loop"),
                'MIX',
                MIX_DURATION
            );
        }
    }

    loadBgMedia(layer, index) {
        if (this.props.getTabSettingsProps(this.props.ccgOutputProps, "autoPlay")) {
            this.props.ccgConnectionProps.loadbgAuto(
                this.props.ccgOutputProps,
                layer,
                this.thumbList[index].name,
                this.props.getTabSettingsProps(this.props.ccgOutputProps, "loop"),
                'MIX',
                MIX_DURATION
            );
        } else {
            this.props.ccgConnectionProps.loadbg(
                this.props.ccgOutputProps,
                layer,
                this.thumbList[index].name,
                this.props.getTabSettingsProps(this.props.ccgOutputProps, "loop"),
                'MIX',
                MIX_DURATION
            );
        }
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

    renderThumbnail(index) {
        return(
            <li key={index} className="boxComponent">
                <img src={this.thumbList[index].thumbPix}
                    className="thumbnailImage"
                    style = {Object.assign({},
                        this.thumbList[index].tally ?
                            {borderWidth: '4px'} : {borderWidth: '0px'},
                            this.thumbList[index].tallyBg ?
                            {boxShadow: '0px 0px 1px 5px green'} : {boxShadow: ''}
                    )}
                />
                <button className="thumbnailImageClickPvw"
                    onClick={() => this.loadBgMedia(10, index)}
                />
                <button className="thumbnailImageClickPgm"
                    onClick={() => this.loadMedia(10, index)}
                />
                <a className="playing">
                    {this.thumbList[index].tally ?
                        this.secondsToTimeCode(this.thumbList[index].timeLeft)
                        : ""
                    }
                </a>
                <p className="text">
                    {this.thumbList[index].name.substring(this.thumbList[index].name.lastIndexOf('/')+1).slice(-45)}
                </p>
            </li>
        )
    }

    render() {
        return (
        <div className="Thumb-body">
            <ul className="flexBoxes" >
                {this.state.thumbListRendered}
            </ul>
        </div>
    )}

}
export default Thumbnail
