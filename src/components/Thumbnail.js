import React, { Component, PureComponent } from 'react';
import '../assets/css/Thumbnail.css';
import './App';
import gql from "graphql-tag";

//Global const:
const fps = 25;
const mixDuration = 6;

//thumb counterDown reference:
var thumbTimer;
var thumbCountTimer;



class Thumbnail extends PureComponent {
    //Props:
    //ccgOutputProps what output on CCG to play at
    //ccgConnectionProps Current CCG connection
    //ccgStateConnectionProps Current CCG-state connection
    //setActivePgmPixProps Reference to Set Header PGMpix
    //setActivePvmPixProps Reference to Set Header Pvmpix
    //setPgmCounterProps Sets the timer in header
    //getTabStateProps returns TRUE/FALSE Is this tab loaded
    //getTabSettingsProps return the setting parameter from argument

    constructor(props) {
        super(props);
        this.state = {
            thumbList: [],
            thumbPix: [],
            thumbListRendered: [],
            thumbActiveState: {},
            thumbActiveIndex: 0,
            thumbActiveBgIndex: 0,
            isTabActive: false,
        };
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
        this.props.ccgConnectionProps.thumbnailList(this.props.getTabSettingsProps(this.props.ccgOutputProps,'subFolder'))
        .then((results) => {
            results.response.data.map((item) => {
                this.props.ccgConnectionProps.thumbnailRetrieve(item.name)
                .then((pixResponse) => {
                    item.thumbPix = pixResponse.response.data;
                    item.tally = false;
                    item.tallyBg = false;
                    item.isActive = false;
                    item.timeLeft = 0;
                    this.setState((prevState) => ({
                        thumbList: [...prevState.thumbList, item]
                    }));
                    this.updateThumbnail(this.state.thumbList.length - 1);
                    console.log("Data loaded");
                });
            });
            // Timer playing & tally status:
            this.updatePlayingStatus();
            thumbTimer = setInterval(this.updatePlayingStatus, 400);
            thumbCountTimer = setInterval(this.updateTimerStatus, 40);
        })
        .catch ((error) => {
            if (error.response.code === 404 ) {
                window.alert("Folder: " + this.props.getTabSettingsProps(this.props.ccgOutputProps, 'subFolder') + " does not exist");
            }
        });


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


    // Timer controlled check of playing & tally status
    updatePlayingStatus() {
        var thisActive = this.props.getTabStateProps(this.props.ccgOutputProps);
        if (!this.state.isTabActive && thisActive) {
            this.setState({isTabActive: thisActive});
        } else if (!thisActive)
        {
            this.setState({isTabActive: thisActive});
        }
        //only update when tab is selected:
        if (thisActive) {
            const queryLayer = {
                query: gql`
                query layer($ch: Int = 1, $l: Int = 10) {
                    layer(ch: $ch, l: $l)
                }
            `};
            const queryOptions = {
                options: (props) => ({
                    variables: { ch: this.props.ccgOutputProps, l: 10 },
                    fetchPolicy: 'network-only'
                })
            };
            this.props.ccgStateConnectionProps.query(queryLayer, queryOptions)
            .then ((response)=>{
                var infoStatus = JSON.parse(response.data.layer);
                this.setState({ thumbActiveState: infoStatus} );
                var fileNameFg = this.cleanUpFilename(infoStatus.foreground.name || '');
                var fileNameBg = this.cleanUpFilename(infoStatus.background.name || '');

                this.state.thumbList.map((item, index)=>{
                    //Handle Foreground:
                    if(fileNameFg === item.name) {
                        // Check and remove Red Tally
                        if(this.state.thumbActiveIndex != index) {
                            this.setStateThumbListElement(this.state.thumbActiveIndex, "tally", false);
                            this.setStateThumbListElement(this.state.thumbActiveIndex, "isActive", false);
                            this.updateThumbnail(this.state.thumbActiveIndex);
                        }

                            this.setStateThumbListElement(index, "tally", true);
                            this.setState({thumbActiveIndex: index});
                            this.setStateThumbListElement(index, "isActive", true);
                            this.setStateThumbListElement(index, "loop", infoStatus.foreground.loop);
                            this.updateThumbnail(index);
                            this.props.setActivePgmPixProps(item.thumbPix);
                    }
                    //Handle Background:
                    if(fileNameBg === item.name) {
                        if(this.state.thumbActiveBgIndex != index) {
                            // Remove Old Green Tally
                            this.setStateThumbListElement(this.state.thumbActiveBgIndex, "tallyBg", false);
                            this.updateThumbnail(this.state.thumbActiveBgIndex);
                        }
                        // Add Active Green Tally
                        this.setStateThumbListElement(index, "tallyBg", true);
                        this.setState({thumbActiveBgIndex: index});
                        this.updateThumbnail(index);
                        this.props.setActivePvwPixProps(item.thumbPix);

                    }
                });
            })
            .catch ((error)=> {
                console.log(error);
            });
        }
    }


    // Timer controlled countdown status status
    updateTimerStatus() {
        //only update timer when tab is selected:
        if (this.state.isTabActive) {
            const queryTimeLeft = {
                query: gql`
                query timeLeft($ch: Int = 1, $l: Int = 10) {
                    timeLeft(ch: $ch, l: $l)
                }
            `};
            const queryOptions = {
                options: (props) => ({
                    variables: { ch: this.props.ccgOutputProps, l: 10 },
                    fetchPolicy: 'network-only'
                })
            };
            this.props.ccgStateConnectionProps.query(queryTimeLeft, queryOptions)
            .then ((response)=>{
                var timeLeft = parseFloat(response.data.timeLeft);
                this.setStateThumbListElement(this.state.thumbActiveIndex, "timeLeft", timeLeft);
                this.updateThumbnail(this.state.thumbActiveIndex);
                this.props.setPgmCounterProps(this.secondsToTimeCode( timeLeft));
            })
            .catch ((error)=> {
                console.log(error);
            });
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

    setStateThumbListElement(index, element, value) {
        var prevStateThumblist = this.state.thumbList;
        prevStateThumblist[index][element] = value;
        this.setState(
            {object: prevStateThumblist}
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
            this.state.thumbList[index].name,
            this.props.getTabSettingsProps(this.props.ccgOutputProps, "loop"),
            'MIX',
            mixDuration
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
                this.state.thumbList[index].name,
                this.props.getTabSettingsProps(this.props.ccgOutputProps, "loop"),
                'MIX',
                mixDuration
            );
        }
    }

    loadBgMedia(layer, index) {
        if (this.props.getTabSettingsProps(this.props.ccgOutputProps, "autoPlay")) {
            this.props.ccgConnectionProps.loadbgAuto(
                this.props.ccgOutputProps,
                layer,
                this.state.thumbList[index].name,
                this.props.getTabSettingsProps(this.props.ccgOutputProps, "loop"),
                'MIX',
                mixDuration
            );
        } else {
            this.props.ccgConnectionProps.loadbg(
                this.props.ccgOutputProps,
                layer,
                this.state.thumbList[index].name,
                this.props.getTabSettingsProps(this.props.ccgOutputProps, "loop"),
                'MIX',
                mixDuration
            );
        }
    }

    secondsToTimeCode(time) {
        if (time) {
            var hour = ('0' + (time/(60*60)).toFixed()).slice(-2);
            var minute = ('0' + (time/(60)).toFixed()).slice(-2);
            var sec = ('0' + time.toFixed()).slice(-2);
            var frm = ('0' + (100*(time - parseInt(time))*(fps/100)).toFixed()).slice(-2);
        return (
            hour + "." + minute + "." + sec + "." + frm
        );
        } else {
            return "00.00.00.00";
        }
    }

    updateThumbnail(index) {
        var prevStateList = this.state.thumbListRendered;
        prevStateList[index] = this.renderThumbnail(index);
        this.setState({thumbListRendered: prevStateList});
        return;
    }

    renderThumbnail(index) {
        return(
            <li key={index} className="boxComponent">
                <img src={this.state.thumbList[index].thumbPix}
                    className="thumbnailImage"
                    style = {Object.assign({},
                        this.state.thumbList[index].tally ?
                            {borderWidth: '4px'} : {borderWidth: '0px'},
                            this.state.thumbList[index].tallyBg ?
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
                    {this.state.thumbList[index].isActive ?
                        this.secondsToTimeCode(this.state.thumbList[index].timeLeft)
                        : ""
                    }
                </a>
                <p className="text">
                    {this.state.thumbList[index].name.substring(this.state.thumbList[index].name.lastIndexOf('/')+1).slice(-45)}
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
