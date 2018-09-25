import React, { Component } from 'react';
import '../assets/css/Thumbnail.css';
import './App';
import { AMCP } from 'casparcg-connection';

//Global const:
const fps = 25;

//thumb counterDown reference:
var thumbTimer;


class Thumbnail extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            thumbList: [],
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

    componentDidMount() {
        this.props.ccgConnectionProps.thumbnailList(this.props.subFolderProps)
        .then((results) => {
            results.response.data.map((item) => {
                item.tally = false;
                item.tallyBg = false;
                item.isActive = false;
                item.loop = false;
                this.setState((prevState) => ({
                    thumbList: [...prevState.thumbList, item] 
                }));
                this.updateThumbnail(this.state.thumbList.length - 1);
            });
        })
        .catch ((error) => {
            if (error.response.code === 404 ) {
                window.alert("Folder: " + this.props.subFolderProps + " does not exist");
            }
        });
    
        // Timer connection status:
        this.updatePlayingStatus();
        thumbTimer = setInterval(this.updatePlayingStatus, 250);

    }

    // Timer controlled connection status
    updatePlayingStatus() {
        var forceUpdate = false;
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
                    if (infoStatus.response.data.foreground.producer["file-frame-number"] != this.state.thumbActiveForegroundProducer["file-frame-number"] || forceUpdate) {
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

    cleanUpFilename(filename) {
        // casparcg-connection library bug: returns filename with media// or media/
        return (filename.replace(/\\/g, '/')
            .replace('media//', '')
            .replace('media/', '')
            .toUpperCase()
            .replace(/\..+$/, '')
        );
    }

    //Generic function for updating setStae of Elements in object:
    setThumbListElement(index, element, value) {
        var prevStateThumblist = this.state.thumbList;
        prevStateThumblist[index][element] = value;
        this.setState(
            {object: prevStateThumblist}
        );
    }

    playMedia(layer, index) {
        this.props.ccgConnectionProps.play(
            this.props.ccgOutputProps, 
            layer, 
            this.state.thumbList[index].name, 
            this.state.thumbList[index].loop, 
            'MIX', 
            5
        );
    }

    mixPlay(layer) {
        this.props.ccgConnectionProps.play(
            this.props.ccgOutputProps, 
            layer
        );
    }

    loadMedia(layer, index) {
        this.props.ccgConnectionProps.load(
            this.props.ccgOutputProps, 
            layer, 
            this.state.thumbList[index].name, 
            this.state.thumbList[index].loop, 
            'MIX', 
            5
        );
    }

    loadBgMedia(layer, index) {
        this.props.ccgConnectionProps.loadbg(
            this.props.ccgOutputProps, 
            layer, 
            this.state.thumbList[index].name, 
            this.state.thumbList[index].loop, 
            'MIX', 
            5
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
        this.props.ccgConnectionProps.thumbnailRetrieve(this.state.thumbList[index].name)
        .then((pixResponse) => {
            if (this.state.thumbList[index].name.includes(this.props.subFolderProps)) {
                prevStateList[index] = this.renderThumbnails(index, pixResponse.response.data);
                this.setState({thumbListRendered: prevStateList});
            }
        });
        return;
    }
    
    renderThumbnails(index, pix) {
        var item = this.state.thumbList[index];
        return(
            <li key={index} className="boxComponent">
                <img src={pix} 
                    className="thumbnailImage" 
                    style = {Object.assign({},
                        item.tally ? 
                            {borderColor: 'red'} : {borderColor: ''},
                        item.tallyBg ? 
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
                    {item.isActive ? 
                        this.framesToTimeCode(this.state.thumbActiveForegroundProducer["file-nb-frames"] - this.state.thumbActiveForegroundProducer["file-frame-number"]) 
                        : "" 
                    }
                </a>
                <a className="text">
                    {item.name.substring(item.name.lastIndexOf('/')+1).slice(-45)}
                </a>
                <br/>
                <button className="playButton" 
                    onClick={() =>
                        this.playMedia(10, index)
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
            <div className="mixButtonBackground">
            <button className="mixButton" 
                onClick={
                    () => this.mixPlay(10)
                }>
                PVW-MIX
            </button>
            <button className="startButton" 
                onClick={
                    () => this.playMedia(10, this.state.thumbActiveIndex)
                }>
                PGM
            </button>
            </div>
            <ul className="flexBoxes" >
                {this.state.thumbListRendered}           
            </ul>
        </div>
    )}

}
export default Thumbnail