import React, { Component } from 'react';
import '../assets/css/Thumbnail.css';
import './App';

class Thumbnail extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            thumbList: [],
            thumbListRendered: [],
            thumbActiveClip: {
                foreground: {
                    producer: {
                        filename: "",
                        loop: false
                    }
                }
            },
            thumbActiveIndex: 0,
            thumbFrameNumber: 0,
        };
        this.renderThumbnails = this.renderThumbnails.bind(this);
        this.updateThumbnail = this.updateThumbnail.bind(this);
        this.updatePlayingStatus = this.updatePlayingStatus.bind(this);
    }
    componentDidMount() {
        this.props.ccgConnectionProps.thumbnailList()
        .then((results) => {
            results.response.data.map((item) => {
                if (item.name.includes(this.props.subFolderProps)) {
                    this.setState((prevState) => ({
                        thumbList: [...prevState.thumbList, item] 
                    }));
                    this.updateThumbnail(item, this.state.thumbList.length - 1, false);
                }
            });
        });

        // Initialize timer connection status:
        this.updatePlayingStatus;
        setInterval(this.updatePlayingStatus, 150);

    }

    // Timer controlled connection status
    updatePlayingStatus() {
        this.props.ccgConnectionProps.info(1,10)
        .then ((infoStatus)=>{
            this.state.thumbList.map((item, index)=>{
                if(this.cleanUpFilename(infoStatus.response.data.foreground.producer.filename) === ("MEDIA//" + item.name)) {
                    if(this.state.thumbActiveIndex != index) {
                        this.updateThumbnail(this.state.thumbList[this.state.thumbActiveIndex], this.state.thumbActiveIndex, false);
                    }
                    if (infoStatus.response.data.foreground.producer["file-frame-number"] != this.state.thumbActiveClip.foreground.producer["file-frame-number"]) {
                        this.setState({thumbActiveClip: infoStatus.response.data});
                        this.setState({thumbActiveIndex: index});
                        this.updateThumbnail(item, this.state.thumbActiveIndex, true);
                    }
                    else {
                        this.updateThumbnail(item, this.state.thumbActiveIndex, false);
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
                .toUpperCase()
                .replace(/\..+$/, '')
            )
        }
        
        
    playMedia(channel, layer, mediaSource, loop) {
        this.props.ccgConnectionProps.play(channel, layer, mediaSource, loop);
    }
        
    updateThumbnail(item, index, isActive) {
        var itemList = this.state.thumbListRendered;
        this.props.ccgConnectionProps.thumbnailRetrieve(item.name)
        .then((response) => {
            if (item.name.includes(this.props.subFolderProps)) {
                itemList[index] = this.renderThumbnails(item, response.response.data, index, isActive);
                this.setState({thumbListRendered: itemList});
            }
        });
        return;
    }
    
    renderThumbnails(item, pic, index, isActive) {
        return(
            <li key={index} className="boxComponent">
                <img src={pic} className="listThumbnail"/>
                <a className="playing">{isActive ? " PLAYING " : "" }</a>
                <br/>
                <a className="text">{item.name.slice(-20)}</a>
                <br/>
                <button className="playButton" onClick={() =>
                    this.playMedia(1, 10, item.name, false)
                }>PLAY</button>
                <button className="loopButton" onClick={() =>
                    this.playMedia(1, 10, item.name, true)
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
        )
    }
}
export default Thumbnail