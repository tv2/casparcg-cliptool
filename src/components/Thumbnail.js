import React, { Component } from 'react';
import '../assets/css/Thumbnail.css';
import './App';

class Thumbnail extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            fileList: [],
            thumbList: [],
        };
        this.renderThumbnails = this.renderThumbnails.bind(this);
    }
    componentDidMount() {
        this.props.ccgConnectionProps.thumbnailList()
        .then((results) => {
            var itemList = [];
            results.response.data.map((item, index) => {
                this.props.ccgConnectionProps.thumbnailRetrieve(item.name)
                .then((response) => {
                    if (item.name.includes(this.props.subFolderProps)) {
                        itemList[index] = this.renderThumbnails(item, response.response.data, index);
                        this.setState({thumbList: itemList});
                    }
                });
            });
        });
    }

    renderThumbnails(item, pic, index) {
        return(
            <li key={index} className="styleHouseComponent">
                <img src={pic} className="listThumbnail"/>
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

    playMedia(channel, layer, mediaSource, loop) {
        this.props.ccgConnectionProps.play(channel, layer, mediaSource, loop);
    }

    render() {
    return (
        <div className="app-body">
            <ul className="boxes" >
                {this.state.thumbList}           
            </ul>
        </div>
        )
    }
}
export default Thumbnail