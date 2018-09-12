import React, { Component } from 'react';
import {CasparCG} from 'casparcg-connection';
import { Tabs } from 'rmc-tabs';

// Components:
import Thumbnail from './Thumbnail';
import SettingsPage from './Settings';

//CSS files:
import '../assets/css/Rmc-tabs.css';
import '../assets/css/App.css';

//Load settings.json file: server, port, subfolder
const fs = require('fs');
const electron = require('electron');
const folder = electron.remote.app.getPath('userData');
const globalSettings = JSON.parse(fs.readFileSync(folder + "/settings.json"));

//Define Output Tabs:
//const tabData = globalSettings.tabData;
const tabData = globalSettings.tabData.filter((item) => {
  return item.title != "";
});

class App extends Component {
  constructor(props) {
    super(props);

    this.ccgConnection = new CasparCG(
      {
        host: globalSettings.ipAddress,
        port: globalSettings.port,  
        autoConnect: false,
    });

    this.state = {
      ccgConnectionStatus: false,
      showSettingsMenu: false,      
    };

    this.setConnectionStatus = this.setConnectionStatus.bind(this);
    this.renderConnectionStatus = this.renderConnectionStatus.bind(this);
    this.handleSettingsPage = this.handleSettingsPage.bind(this);
    this.renderTabData = this.renderTabData.bind(this);
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
      <a className="App-connection-status" style={status ? {backgroundColor: "green"} : {backgroundColor: "red"}}>
        {status ? "CONNECTED" : "CONNECTING..."}
      </a>
    )
  }

  renderTabData() { 
      var tabDataList = tabData.map((item) => {
        return (
        <div key={(item.key)}>
          <p className="App-intro"></p>
          <Thumbnail ccgOutputProps={item.key} ccgConnectionProps={this.ccgConnection} subFolderProps={globalSettings.subFolder}/>
        </div>
        )
      })
      
      return (tabDataList)      
  }

  handleSettingsPage() {
    this.setState({showSettingsMenu: !this.state.showSettingsMenu});
  }

  render() {  
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">CasparCG Clip Tool</h1> 
          <div>
            {this.renderConnectionStatus(this.state.ccgConnectionStatus)}
          </div>
          <button className="App-settings" 
          onClick={this.handleSettingsPage}>SETTINGS</button>
        </header>
        {this.state.showSettingsMenu ? <SettingsPage /> : null }
        <div className="App-body">
          <Tabs tabs={tabData}>
            {this.renderTabData(tabData)}
          </Tabs>
        </div>
      </div>
    )
  }
}

export default App
