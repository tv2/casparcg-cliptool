import React, { Component } from 'react';
import {CasparCG} from 'casparcg-connection';
import { Tabs } from 'rmc-tabs';

// Components:
import Thumbnail from './Thumbnail';

//CSS files:
import '../assets/css/Rmc-tabs.css';
import '../assets/css/App.css';

//Load settings.json file: server, port, subfolder
const fs = require('fs');
const electron = require('electron');
const folder = electron.remote.app.getPath('userData');
const globalSettings = JSON.parse(fs.readFileSync(folder + "/settings.json"));

//Define Output Tabs:
const tabData = [
  { key: 'out1', title: 'SCREEN 1', output: 1},
  { key: 'out2', title: 'SCREEN 2', output: 2},
  { key: 'out3', title: 'SCREEN 3', output: 3},
];

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
    this.renderConnectionStatus = this.renderConnectionStatus.bind(this);
}

  componentDidMount() {
    this.ccgConnection.connect();

    // Initialize timer connection status:
    var temp = setInterval(this.setConnectionStatus, 2000);
    console.log("Timer initiated: " + temp);
  }

  setConnectionStatus() {
    this.timeout(1000, this.ccgConnection.info(1,10))
    .then (() => {
      this.setState({ccgConnectionStatus: true}); 
    })
    .catch((error) =>{
      this.setState({ccgConnectionStatus: false});
      console.log(error);
    });
  }

  timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("Offline: Server was to long to respond"));
    }, ms);
    promise.then(resolve, reject);
  });
}

  renderConnectionStatus(status) {
    return (
      <a className="App-connection-status" style={status ? {color: "green"} : {color: "red"}}>
        {status ? "CONNECTED" : "CONNECTING..."}
      </a>
    )
  }
  render() {  
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">CasparCG Clip Tool</h1> 
          <div>
            {this.renderConnectionStatus(this.state.ccgConnectionStatus)}
          </div>
        </header>
        <div className="App-body">
          <Tabs tabs={tabData}>
            <div key={tabData[0].key}>
              <p className="App-intro"></p>
              <Thumbnail ccgOutputProps={tabData[0].output} ccgConnectionProps={this.ccgConnection} subFolderProps={globalSettings.subfolder}/>
            </div>
            <div key={tabData[1].key}>
              <p className="App-intro"></p>
              <Thumbnail ccgOutputProps={tabData[1].output} ccgConnectionProps={this.ccgConnection} subFolderProps={globalSettings.subfolder}/>
            </div>
            <div key={tabData[2].key}>
              <p className="App-intro"></p>
              <Thumbnail ccgOutputProps={tabData[2].output} ccgConnectionProps={this.ccgConnection} subFolderProps={globalSettings.subfolder}/>
            </div>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default App
