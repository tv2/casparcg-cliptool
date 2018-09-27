import React, { Component } from 'react';
import '../assets/css/Thumbnail.css';
import './App';
import { AMCP } from 'casparcg-connection';

//Global const:
const fps = 25;

//thumb counterDown reference:
var thumbTimer;



class Thumbnail extends Component {
    //Props: 
    //ccgOutputProps what output on CCG to play at 
    //ccgConnectionProps Current CCG connection
    //subFolderProps What folder to work on

    constructor(props) {
        super(props);
        this.state = {  
            thumbList: [],
            thumbPix: [],
            thumbListRendered: [],
            thumbActiveForegroundProducer: {
                filename: "",
                loop: false,
            },
            thumbActiveIndex: 0,
            thumbActiveBgIndex: 0,
        };
        this.updatePlayingStatus = this.updatePlayingStatus.bind(this);
        this.updateThumbnail = this.updateThumbnail.bind(this);
        this.renderThumbnails = this.renderThumbnails.bind(this);

        this.loadMedia = this.loadMedia.bind(this);
        this.loadBgMedia = this.loadBgMedia.bind(this);
        this.handleLoop =  this.handleLoop.bind(this);
        this.setStateElement = this.setThumbListElement.bind(this);
    }

    componentWillMount() {
        document.addEventListener("keydown", this._handleKeyDown.bind(this));
    }

    //Shortcut for mix and take
    _handleKeyDown(event) {
        const keyOutput = JSON.stringify(this.props.ccgOutputProps).charCodeAt(0);
        switch( event.keyCode ) {
            case keyOutput:
                this.playMedia(
                    10, 
                    this.state.thumbActiveBgIndex, 
                    this.state.thumbActiveIndex
                );
                break;
            default: 
                break;
        }
    }
    

    componentDidMount() {
        this.props.ccgConnectionProps.thumbnailList(this.props.subFolderProps)
        .then((results) => {
            results.response.data.map((item) => {
                this.props.ccgConnectionProps.thumbnailRetrieve(item.name)
                .then((pixResponse) => {
                    item.thumbPix = pixResponse.response.data;
                    item.tally = false;
                    item.tallyBg = false;
                    item.isActive = false;
                    item.loop = false;
                    this.setState((prevState) => ({
                        thumbList: [...prevState.thumbList, item] 
                    }));
                    this.updateThumbnail(this.state.thumbList.length - 1);
                });
            });
        })
        .catch ((error) => {
            if (error.response.code === 404 ) {
                window.alert("Folder: " + this.props.subFolderProps + " does not exist");
            }
        });
    
        // Timer connection status:
        this.updatePlayingStatus();
        thumbTimer = setInterval(this.updatePlayingStatus, 500);

    }

    // Timer controlled connection status
    updatePlayingStatus() {
        var forceUpdate = false;
        if (this.props.activeTabProps === this.props.ccgOutputProps - 1 ) {
            this.props.ccgConnectionProps.info(this.props.ccgOutputProps, 10)
            .then ((infoStatus)=>{
                // casparcg-connection library bug: returns filename in either .filename or .location
                var fileNameFg = this.cleanUpFilename(infoStatus.response.data.foreground.producer.filename || infoStatus.response.data.foreground.producer.location);
                this.state.thumbList.map((item, index)=>{
                    if(fileNameFg === item.name) {
                        
                        // Check and remove Red Tally
                        if(this.state.thumbActiveIndex != index) {
                            this.setThumbListElement(this.state.thumbActiveIndex, "tally", false);
                            this.setThumbListElement(this.state.thumbActiveIndex, "isActive", false);
                            this.updateThumbnail(this.state.thumbActiveIndex);
                            forceUpdate = true;
                        }

                        // Update only first time or if time if file is playing:
                        if (forceUpdate || infoStatus.response.data.foreground.producer["file-frame-number"] != this.state.thumbActiveForegroundProducer["file-frame-number"]) {
                            this.setThumbListElement(index, "tally", true);
                            this.setState({thumbActiveForegroundProducer: infoStatus.response.data.foreground.producer});
                            this.setState({thumbActiveIndex: index});
                            this.setThumbListElement(index, "isActive", true);
                            this.setThumbListElement(index, "loop", infoStatus.response.data.foreground.producer.loop);
                            this.updateThumbnail(index);
                        }
                    }
                });
                
                // casparcg-connection library bug: returns filename in either .filename or .location
                var fileNameBg = this.cleanUpFilename(infoStatus.response.data.background.producer.filename || infoStatus.response.data.background.producer.location || '');
                this.state.thumbList.map((item, index)=>{
                    if(fileNameBg === item.name) {
                        
                        if(this.state.thumbActiveBgIndex != index) {
                            // Remove Old Green Tally
                            this.setThumbListElement(this.state.thumbActiveBgIndex, "tallyBg", false);
                            this.updateThumbnail(this.state.thumbActiveBgIndex);
                            // Add Active Green Tally
                            this.setThumbListElement(index, "tallyBg", true);
                            this.setState({thumbActiveBgIndex: index});
                            this.updateThumbnail(index);
                        }
                    }
                });
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

    setThumbListElement(index, element, value) {
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
            this.state.thumbList[index].loop, 
            'MIX', 
            6
        );
        this.loadBgMedia(10, indexBg);
    }

    loadMedia(layer, index) {
        this.props.ccgConnectionProps.load(
            this.props.ccgOutputProps, 
            layer, 
            this.state.thumbList[index].name, 
            this.state.thumbList[index].loop, 
            'MIX', 
            6
        );
    }

    loadBgMedia(layer, index) {
        this.props.ccgConnectionProps.loadbg(
            this.props.ccgOutputProps, 
            layer, 
            this.state.thumbList[index].name, 
            this.state.thumbList[index].loop, 
            'MIX', 
            6
        );
    }

    handleLoop(index) {
        this.setThumbListElement(index, 'loop', !this.state.thumbList[index].loop);
        this.updateThumbnail(index);
        if(this.state.thumbActiveIndex === index) {
            const call = new AMCP.CustomCommand('CALL 1-10 LOOP');
            this.props.ccgConnectionProps.do(call)
            .catch((error) => {
                console.log(error);
            });
        }
    }

    framesToTimeCode(frame) {
        if (frame) {
            var hour = ('0' + (frame/(fps*60*60)).toFixed()).slice(-2);
            var minute = ('0' + (frame/(fps*60)).toFixed()).slice(-2);
            var sec = ('0' + (frame/(fps)).toFixed()).slice(-2);
            var frm = ('0' + (frame-parseInt(frame/fps)*fps).toFixed()).slice(-2);
        return (
            hour + "." + minute + "." + sec
        );
        } else {
            return "";
        }
    }
        
    updateThumbnail(index) {
        var prevStateList = this.state.thumbListRendered;
        prevStateList[index] = this.renderThumbnails(index);
        this.setState({thumbListRendered: prevStateList});
        return;
    }
    
    renderThumbnails(index) {
        return(
            <li key={index} className="boxComponent">
                <img src={this.state.thumbList[index].thumbPix} 
                    className="thumbnailImage" 
                    style = {Object.assign({},
                        this.state.thumbList[index].tally ? 
                            {borderColor: 'red'} : {borderColor: ''},
                            this.state.thumbList[index].tallyBg ? 
                            {boxShadow: '0px 0px 1px 3px green'} : {boxShadow: ''} 
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
                        this.framesToTimeCode(this.state.thumbActiveForegroundProducer["file-nb-frames"] - this.state.thumbActiveForegroundProducer["file-frame-number"]) 
                        : "" 
                    }
                </a>
                <a className="text">
                    {this.state.thumbList[index].name.substring(this.state.thumbList[index].name.lastIndexOf('/')+1).slice(-45)}
                </a>
                <br/>
                <button className="playButton" 
                    onClick={() =>
                        this.playMedia(10, index, this.state.thumbActiveBgIndex)
                    }>
                    PLAY
                </button>
                <button className="loopButton" 
                    style={this.state.thumbList[index].loop ? 
                        {backgroundColor: 'rgb(28, 115, 165)'} : {backgroundColor: 'grey'}
                    } 
                    onClick={() =>
                        this.handleLoop(index)
                    }>
                    LOOP
                </button>
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