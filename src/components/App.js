import '../assets/css/App.css';
import React, { Component } from 'react';
import {CasparCG} from 'casparcg-connection';
import Thumbnail from './Thumbnail';

//Load settings.json file: server, port, subfolder
const fs = require('fs');
const electron = require('electron');

var folder = electron.remote.app.getPath('userData');
var globalSettings = JSON.parse(fs.readFileSync(folder + "/settings.json"));

class App extends Component {
  constructor(props) {
    super(props);

    this.ccgConnection = new CasparCG(
      {
        host: globalSettings.server,
        port: globalSettings.port,  
        autoConnect: false,
    });

    this.state = {
      ccgConnectionStatus: false,
      ccgThumbnails: []
    };

    this.setConnectionStatus = this.setConnectionStatus.bind(this);
}

  componentDidMount() {
    this.ccgConnection.connect();

    // Initialize timer connection status:
    var temp = setInterval(this.setConnectionStatus, 1000);
    console.log("Timer initiated: " + temp);
  }

  setConnectionStatus() {
      this.setState({ccgConnectionStatus: this.ccgConnection.connectionStatus.connected});
  }

  stopMedia(channel, layer) {
    this.ccgConnection.stop(channel, layer);
  }

  render() {  
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">CasparCG Clip Tool</h1> 
          <a>Connection status: </a> 
          <a style={{color: "red"}}>{this.state.ccgConnectionStatus ? "Connected" : "not Connected"}</a>
          <button className="stopButton" onClick={() =>
                    this.stopMedia(1, 10)
                }>STOP</button>
        </header>
        <Thumbnail ccgConnectionProps={this.ccgConnection} subFolderProps={globalSettings.subfolder}/>
      </div>
    )
  }
}

export default App
