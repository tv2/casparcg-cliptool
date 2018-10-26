import React, { Component } from 'react';
import {CasparCG} from 'casparcg-connection';
import { Tabs } from 'rmc-tabs';
import { GraphQLClient, request } from 'graphql-request';

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

//TimerReference:
var connectionTimer;

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
        ccgConnectionStatus: false,
        showSettingsMenu: false,
        activeTab: 0,
        activeTabTitle: '',
        activePvwPix: '',
        activePgmPix: '',
        pgmCounter: '',
        tabData: [],
        globalSettings: {
            ipAddress: 'localhost',
            port: '5250',
            mainFolder: '',
            tabData: [
                { key: 1, title: 'SCREEN 1', subFolder: '', loop: false, autoPlay: false},
                { key: 2, title: 'SCREEN 2', subFolder: '', loop: false, autoPlay: false},
                { key: 3, title: 'SCREEN 3', subFolder: '', loop: false, autoPlay: false},
                { key: 4, title: '', subFolder: '', loop: false, autoPlay: false},
                { key: 5, title: '', subFolder: '', loop: false, autoPlay: false},
                { key: 6, title: '', subFolder: '', loop: false, autoPlay: false},
            ],
        },
        };

        this.checkConnectionStatus = this.checkConnectionStatus.bind(this);
        this.handleSettingsPage = this.handleSettingsPage.bind(this);
        this.setActivePgmPix = this.setActivePgmPix.bind(this);
        this.setActivePvwPix = this.setActivePvwPix.bind(this);
        this.setPgmCounter = this.setPgmCounter.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.handleAutoPlayStatus = this.handleAutoPlayStatus.bind(this);
        this.handleLoopStatus = this.handleLoopStatus.bind(this);

    }

    componentDidMount() {
        // Load Settings,
        // use mountSettings in ComponentDidMount (as SetState is async)
        var mountSettings = this.loadSettings();
        this.setState({globalSettings: mountSettings});

        //Define Output Tabs:
        this.setState({tabData: mountSettings.tabData.filter((item) => {
        return item.title != "";
        })
        });

        // in current version of casparcg-connection the port has to be assigned as a seperate parameter.
        this.ccgConnection = new CasparCG(
        {
            host: mountSettings.ipAddress,
            port: mountSettings.port,
            autoConnect: false,
        });
        this.ccgConnection.connect();

        // Initialize CasparCG-State-Scanner acess:
        this.ccgStateConnection = new GraphQLClient("http://" + mountSettings.ipAddress + ":5254/api");

        // Initialize timer connection status:
        connectionTimer = setInterval(this.checkConnectionStatus, 2000);
    }

    //Logical funtions:

    reloadPage() {
        location.reload();
    }

    loadSettings() {
        var settingsInterface = this.state.globalSettings;
        try {
        const settingsFromFile = JSON.parse(fs.readFileSync(folder + "/settings.json"));
        if (this.compareOldNewSettings(settingsFromFile, settingsInterface)) {
            settingsFromFile.tabData.map((item, index) => {
            item.loop = item.loop || false;
            item.autoPlay = item.autoPlay || false;
            });
            return (settingsFromFile);
        } else {
            return settingsInterface;
        }
        } catch (error) {
        return (settingsInterface);
        }
    }

    compareOldNewSettings(a, b) {
        var aKeys = Object.keys(a).sort();
        var bKeys = Object.keys(b).sort();
        return JSON.stringify(aKeys) === JSON.stringify(bKeys);
    }

    saveSettings(settings) {
        var json = JSON.stringify(settings);
        fs.writeFile(folder + "/settings.json", json, 'utf8', (error)=>{
            console.log(error);
        });
    }

    getTabSettings(ccgOutput, argument) {
        return this.state.globalSettings.tabData[ccgOutput-1][argument];
    }

    checkConnectionStatus() {
        const query = /* GraphQL */ `
        {
            timeLeft(ch: 1,l: 10)
        }
        `;
        this.ccgStateConnection.request(query)
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
        /*
        this.timeoutPromise(1000, this.ccgConnection.version())
        .then (() => {


        this.setState({ccgConnectionStatus: true});
        })
        .catch((error) =>{
        this.setState({ccgConnectionStatus: false});
        console.log(error);
        });
        */
    }

    timeoutPromise(ms, promise) {
        return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Offline: Server was to long to respond"));
        }, ms);
        promise.then(resolve, reject);
        });
    }

    //Handler functions:
    handleAutoPlayStatus() {
        var settingsCopy= Object.assign({}, this.state.globalSettings);
        settingsCopy.tabData[this.state.activeTab].autoPlay = !settingsCopy.tabData[this.state.activeTab].autoPlay;
        this.setState(
            {globalSettings: settingsCopy}
        );
    }

    handleLoopStatus() {
        var settingsCopy= Object.assign({}, this.state.globalSettings);
        settingsCopy.tabData[this.state.activeTab].loop = !settingsCopy.tabData[this.state.activeTab].loop;
        this.setState(
            {globalSettings: settingsCopy}
        );
        this.saveSettings(this.state.globalSettings);
    /* ToDo: When pressing LOOP while playing, change state of playing media:
                const call = new AMCP.CustomCommand('CALL 1-10 LOOP');
                this.props.ccgConnectionProps.do(call)
                .catch((error) => {
                    console.log(error);
                });
    */
    }

    setActivePgmPix(pix) {
        this.setState({activePgmPix: pix});
    }

    setActivePvwPix(pix) {
        this.setState({activePvwPix: pix});
    }

    setPgmCounter(val) {
        this.setState({pgmCounter: val});
    }
    setActiveTab(tab) {
        this.setState({activeTab: tab});
    }

    getTabState(channel) {
        return (this.state.activeTab === channel -1);
    }

    //Rendering functions:

    renderHeader() {
        return (
        <header className="App-header">
            <div className="App-title-background">
            <img src={this.state.activePvwPix} className="headerPvwThumbnailImage" />
            <button className="headerPgmCounter">
                {this.state.pgmCounter}
            </button>
            <img src={this.state.activePgmPix} className="headerPgmThumbnailImage" />
            </div>

            <div className="Reload-setup-background">
            <button className="App-connection-status"
                style={this.state.ccgConnectionStatus ? {backgroundColor: "rgb(0, 128, 4)"} : {backgroundColor: "red"}}>
                {this.state.ccgConnectionStatus ? "CONNECTED" : "CONNECTING"}
            </button>
            <button className="App-settings-button"
                onClick={this.handleSettingsPage}>
                SETTINGS
            </button>
            <button className="Reload-button"
                onClick={this.reloadPage}>
                RELOAD
            </button>
            </div>

            <div className="loop-autoPlay-background">
            <button className="loop-button"
                onClick={this.handleLoopStatus}
                style={this.state.globalSettings.tabData[this.state.activeTab].loop ? {backgroundColor: 'rgb(28, 115, 165)'} : {backgroundColor: 'grey'}}
            >
                LOOP
            </button>
            <button className="autoPlay-button"
                onClick={this.handleAutoPlayStatus}
                style={this.state.globalSettings.tabData[this.state.activeTab].autoPlay ? {backgroundColor: 'red'} : {backgroundColor: 'grey'}}
            >
                AUTO START
            </button>
            </div>

            <div className="mixButtonBackground">
            <a className="mixButtonText">START:</a>
            <br/>
            <button className="mixButton"
                onClick={
                    () => this.refs[("thumbnailRef" + ( this.state.activeTab + 1))].pvwPlay()
                }>
                PVW
            </button>
            <button className="startButton"
                onClick={
                    () => this.refs[("thumbnailRef" + ( this.state.activeTab + 1))].pgmPlay()
                }>
                PGM
            </button>
            </div>
        </header>
        )
    }

    renderTabData() {
        var tabDataList = this.state.tabData.map((item) => {
            return (
            <div className="App-intro" key={(item.key)}>
            <Thumbnail
                ref={"thumbnailRef" + item.key}
                ccgOutputProps={item.key}
                ccgConnectionProps={this.ccgConnection}
                ccgStateConnectionProps={this.ccgStateConnection}
                setActivePvwPixProps={this.setActivePvwPix.bind(this)}
                setActivePgmPixProps={this.setActivePgmPix.bind(this)}
                getTabStateProps={this.getTabState.bind(this)}
                setPgmCounterProps={this.setPgmCounter.bind(this)}
                getTabSettingsProps={this.getTabSettings.bind(this)}
            />
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
            {this.renderHeader()}
            {this.state.showSettingsMenu ?
            <SettingsPage globalSettingsProps={this.state.globalSettings} loadSettingsProps={this.loadSettings.bind(this)} saveSettingsProps={this.saveSettings.bind(this)}/>
            : null }
            <div className="App-body">
            <Tabs tabs={this.state.tabData} onChange={(tab, index) => this.setActiveTab(index)}>
                {this.renderTabData()}
            </Tabs>
            </div>
        </div>
        )
    }
}

export default App
