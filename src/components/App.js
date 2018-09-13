import React, { Component } from 'react';
import {CasparCG} from 'casparcg-connection';
import { Tabs } from 'rmc-tabs';

// Components:
import Thumbnail from './Thumbnail';
import SettingsPage from './Settings';

//CSS files:
import '../assets/css/Rmc-tabs.css';
import '../assets/css/App.css';

//Load settings.json file:
const fs = require('fs');
const electron = require('electron');
const folder = electron.remote.app.getPath('userData');

//Settings interface:
var settingsInterface = { 
  ipAddress: 'localhost',
  port: '5250',
  subFolder: '',
  tabData: [
      { key: 1, title: 'SCREEN 1'},
      { key: 2, title: 'SCREEN 2'},
      { key: 3, title: 'SCREEN 3'},
      { key: 4, title: ''},
      { key: 5, title: ''},
      { key: 6, title: ''},
  ],
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ccgConnectionStatus: false,
      showSettingsMenu: false, 
      tabData: [], 
      globalSettings: {},    
    };

    this.setConnectionStatus = this.setConnectionStatus.bind(this);
    this.renderConnectionStatus = this.renderConnectionStatus.bind(this);
    this.handleSettingsPage = this.handleSettingsPage.bind(this);
    this.renderTabData = this.renderTabData.bind(this);

  }

  componentDidMount() {
    var mountSettings = this.loadSettings();
    this.setState({globalSettings: mountSettings});

    //Define Output Tabs:
    this.setState({tabData: mountSettings.tabData.filter((item) => {
      return item.title != "";
      })
    });
    this.ccgConnection = new CasparCG(
      {
        host: mountSettings.ipAddress,
        port: mountSettings.port,  
        autoConnect: false,
    });
    this.ccgConnection.connect();

    // Initialize timer connection status:
    var temp = setInterval(this.setConnectionStatus, 2000);
    console.log("Timer initiated: " + temp);
  }

  loadSettings() {
      try {
        const settingsFromFile = JSON.parse(fs.readFileSync(folder + "/settings.json"));
        return (settingsFromFile);
      } catch (error) {
        console.log(error);
        return (settingsInterface);
      }
  }

  saveSettings(settings) {
    var json = JSON.stringify(settings);
    fs.writeFile(folder + "/settings.json", json, 'utf8', (error)=>{
        console.log(error);
    });

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
        {status ? "CONNECTED" : "CONNECTING"}
      </a>
    )
  }

  renderTabData() { 
      var tabDataList = this.state.tabData.map((item) => {
        return (
        <div key={(item.key)}>
          <p className="App-intro"></p>
          <Thumbnail ccgOutputProps={item.key} ccgConnectionProps={this.ccgConnection} subFolderProps={this.state.globalSettings.subFolder}/>
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
          <button className="App-settings-button" 
          onClick={this.handleSettingsPage}>SETTINGS</button>
        </header>
        {this.state.showSettingsMenu ? 
          <SettingsPage loadSettingsProps={this.loadSettings.bind(this)} saveSettingsProps={this.saveSettings.bind(this)}/> 
          : null }
        <div className="App-body">
          <Tabs tabs={this.state.tabData}>
            {this.renderTabData()}
          </Tabs>
        </div>
      </div>
    )
  }
}

export default App
