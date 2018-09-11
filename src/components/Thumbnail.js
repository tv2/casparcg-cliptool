import React, { Component } from 'react';
import '../assets/css/Thumbnail.css';
import './App';

//Global const:
const fps = 25;


class Thumbnail extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            thumbList: [],
            thumbListRendered: [],
            thumbActiveForegroundProducer: {
                filename: "",
                loop: false
            },
            thumbActiveIndex: 0,
        };
        this.updatePlayingStatus = this.updatePlayingStatus.bind(this);
        this.updateThumbnail = this.updateThumbnail.bind(this);
        this.renderThumbnails = this.renderThumbnails.bind(this);

        this.playMedia = this.playMedia.bind(this);
    }
    componentDidMount() {
        this.props.ccgConnectionProps.thumbnailList()
        .then((results) => {
            results.response.data.map((item) => {
                if (item.name.includes(this.props.subFolderProps)) {
                    this.setState((prevState) => ({
                        thumbList: [...prevState.thumbList, item] 
                    }));
                    this.updateThumbnail(item, this.state.thumbList.length - 1, false, false);
                }
            });
        });     
        // Timer connection status:
        this.updatePlayingStatus;
        setInterval(this.updatePlayingStatus, 250);

    }

    // Timer controlled connection status
    updatePlayingStatus() {
        this.props.ccgConnectionProps.info(this.props.ccgOutputProps, 10)
        .then ((infoStatus)=>{
            this.state.thumbList.map((item, index)=>{
                if(this.cleanUpFilename(infoStatus.response.data.foreground.producer.filename) === item.name) {
                    // Update Old Thumb when new one is selected:
                    if(this.state.thumbActiveIndex != index) {
                        this.updateThumbnail(this.state.thumbList[this.state.thumbActiveIndex], this.state.thumbActiveIndex, false);
                    }
                    // Check if file is playing:
                    if (infoStatus.response.data.foreground.producer["file-frame-number"] != this.state.thumbActiveForegroundProducer["file-frame-number"]) {
                        this.setState({thumbActiveForegroundProducer: infoStatus.response.data.foreground.producer});
                        this.setState({thumbActiveIndex: index});
                        this.updateThumbnail(item, this.state.thumbActiveIndex, true, true);
                    }
                    else {
                        this.updateThumbnail(item, this.state.thumbActiveIndex, false, true);
                    }

                }
            });
        })
        .catch ((error)=> {
            console.log(error);
        });
    }

    cleanUpFilename(filename) {
        return (filename.replace(/\\/g, '/')
            .replace('media//', '')
            .toUpperCase()
            .replace(/\..+$/, '')
        );
    }

    framesToTimeCode(frame) {
        var hour = ('0' + (frame/(fps*60*60)).toFixed()).slice(-2);
        var minute = ('0' + (frame/(fps*60)).toFixed()).slice(-2);
        var sec = ('0' + (frame/(fps)).toFixed()).slice(-2);
        var frm = ('0' + (frame-parseInt(frame/fps)*fps).toFixed()).slice(-2);
        return (
            hour + "." + minute + "." + sec
        );
    }
        
        
    playMedia(layer, mediaSource, loop) {
        this.props.ccgConnectionProps.play(this.props.ccgOutputProps, layer, mediaSource, loop);
    }
        
    updateThumbnail(item, index, isActive, tally) {
        var itemList = this.state.thumbListRendered;
        this.props.ccgConnectionProps.thumbnailRetrieve(item.name)
        .then((response) => {
            if (item.name.includes(this.props.subFolderProps)) {
                itemList[index] = this.renderThumbnails(item, response.response.data, index, isActive, tally);
                this.setState({thumbListRendered: itemList});
            }
        });
        return;
    }
    
    renderThumbnails(item, pic, index, isActive, tally) {
        return(
            <li key={index} className="boxComponent">
                <img src={pic} className="thumbnailImage" style = {tally ? {borderColor: 'red'} : {borderColor: ''}}/>
                <a className="playing">{isActive ? this.framesToTimeCode(this.state.thumbActiveForegroundProducer["file-nb-frames"] - this.state.thumbActiveForegroundProducer["file-frame-number"]) : "" }</a>
                <a className="text">{item.name.substring(item.name.lastIndexOf('/')+1).slice(-25)}</a>
                <br/>
                <button className="playButton" onClick={() =>
                    this.playMedia(10, item.name, false)
                }>PLAY</button>
                <button className="loopButton" onClick={() =>
                    this.playMedia(10, item.name, true)
                }>LOOP</button>
            </li>
        )
    }
    
    render() {
        return (
        <div className="app-body">
            <ul className="flexBoxes" >
                {this.state.thumbListRendered}           
            </ul>
        </div>
    )}

}
export default Thumbnail