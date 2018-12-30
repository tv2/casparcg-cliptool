import React, { Component, PureComponent } from 'react';
import {CasparCG} from 'casparcg-connection';
import { Tabs } from 'rmc-tabs';

//Apollo-Client Graphql implementation:
import ApolloClient from "apollo-client";
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from "graphql-tag";
import { ALL_CHANNELS_QUERY, ALL_CHANNELS_SUBSCRIPTION } from '../graphql/CasparCgQuery';

//Redux:
import { connect } from "react-redux";

// Components:
import Thumbnail from './Thumbnail';
import SettingsPage from './Settings';
import Header from './Header';

//CSS files:
import '../assets/css/Rmc-tabs.css';
import '../assets/css/App.css';

//Load settings.json file:
const fs = require('fs');
const electron = require('electron');
const folder = electron.remote.app.getPath('userData');

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ccgIsUpdated: 0,
            showSettingsMenu: false,
            tabData: []
        };

        this.checkConnectionStatus = this.checkConnectionStatus.bind(this);
        this.handleSettingsPage = this.handleSettingsPage.bind(this);
        this.handleAutoPlayStatus = this.handleAutoPlayStatus.bind(this);
        this.handleLoopStatus = this.handleLoopStatus.bind(this);
        this.ccgSubscribeTimeLeft = this.ccgSubscribeTimeLeft.bind(this);
        this.ccgSubscribeInfoData = this.ccgSubscribeInfoData.bind(this);
    }


    componentWillMount() {
        document.addEventListener("keydown", this._handleKeyDown.bind(this));
    }


    componentDidMount() {
        // Load Settings,
        // use mountSettings in ComponentDidMount (as SetState is async)
        var mountSettings = this.loadSettings();

        this.props.dispatch({
            type:'UPDATE_SETTINGS',
            data: mountSettings
        });

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

        // Initialize CasparCG-State-Scanner GraphQL:

        const wsLink = new WebSocketLink({
            uri: "ws://" + mountSettings.ipAddress + ":5254/graphql",
            options: {
                reconnect: true
            }
        });

        this.ccgStateConnection = new ApolloClient({
            link: wsLink,
            cache: new InMemoryCache(),
            defaultOptions: {
                watchQuery: {
                    fetchPolicy: 'cache-and-network',
                    errorPolicy: 'ignore',
                },
                query: {
                    fetchPolicy: 'network-only',
                    errorPolicy: 'all',
                },
                mutate: {
                    errorPolicy: 'all'
                }
            }
        });
        // Initialize CasparCG subscriptions:
        this.ccgSubscribeInfoData();
        this.ccgSubscribeTimeLeft();

        // Initialize timer connection status:
        var connectionTimer = setInterval(this.checkConnectionStatus, 2000);
    }

    //Logical funtions:

    reloadPage() {
        location.reload();
    }

    loadSettings() {
        var settingsInterface = this.props.store.settingsReducer[0].settings;
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
        }
        catch (error) {
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
        return this.props.store.settingsReducer[0].settings.tabData[ccgOutput-1][argument];
    }

    checkConnectionStatus() {
        this.ccgStateConnection.query({
            query: gql`
                {
                    serverOnline
                }`
            })
        .then((response) => {
            this.props.dispatch({
                type: 'SET_CONNECTION_STATUS',
                data: response.data.serverOnline
            });
        })
        .catch((error) => {
            console.log(error);
            this.props.dispatch({
                type: 'SET_CONNECTION_STATUS',
                data: false
            });
        });
    }

    //Handler functions:
    handleSettingsPage() {
        this.setState({showSettingsMenu: !this.state.showSettingsMenu});
    }

    handleAutoPlayStatus() {
        this.props.dispatch({
            type:'AUTOPLAY_STATUS',
            data: this.props.store.appNavReducer[0].appNav.activeTab
        });
        this.saveSettings(this.props.store.settingsReducer[0].settings);
    }

    handleLoopStatus() {
        this.props.dispatch({
            type:'LOOP_STATUS',
            data: this.props.store.appNavReducer[0].appNav.activeTab
        });
        this.saveSettings(this.props.store.settingsReducer[0].settings);
    }

    setActiveTab(tab) {
        this.props.dispatch({
            type: 'SET_ACTIVE_TAB',
            data: tab
        });
    }

    ccgSubscribeInfoData() {
        var _this2 = this;
        //Initial query channels to object:
        this.ccgStateConnection.query({
        query: ALL_CHANNELS_QUERY
        })
        .then((response) => {
            console.log("InfoData request Data: ", response.data.channels);
            _this2.props.dispatch({
                type:'SET_INFO_CHANNEL',
                data: response.data.channels
            });

            //Subscribe to CasparCG-State changes:
            this.ccgStateConnection.subscribe({
                query: ALL_CHANNELS_SUBSCRIPTION
            })
            .subscribe({
                next(response) {
                    console.log("infoChannelChanged subscription Data: ", response.data.channels
                    );
                    _this2.setState({ccgIsUpdated: 1});
                    _this2.props.dispatch({
                        type:'SET_INFO_CHANNEL',
                        data: response.data.channels
                    });
                },
                error(err) { console.error('Subscription error: ', err); },
            });
        });
    }


    //Shortcut for mix and take
    _handleKeyDown(event) {
        //Play PVW 1-4 key 1-4:
        const pvwPlay = JSON.stringify(this.props.store.appNavReducer[0].appNav.activeTab+1).charCodeAt(0);
        //Play PGM 1-4 key: QWER:
        const pgmPlay = ["Q", "W", "E", "R"][this.props.store.appNavReducer[0].appNav.activeTab].charCodeAt(0);

        switch( event.keyCode ) {
            case pvwPlay:
                this.playMedia(
                    10,
                    this.state.thumbActiveBgIndex,
                    this.state.thumbActiveIndex
                );
                break;
            case pgmPlay:
                this.playMedia(
                    10,
                    this.state.thumbActiveIndex,
                    this.state.thumbActiveBgIndex
                );
                break;
            default:
                break;
        }
    }




    resetCcgIsUpdated() {
        this.setState({ccgIsUpdated: 0});
    }

    getCcgIsUpdated() {
        return parseInt(this.state.ccgIsUpdated);
    }

    ccgSubscribeTimeLeft() {
        var _this2 = this;
        //Subscribe to CasparCG-State changes:
        this.ccgStateConnection.subscribe({
            query: gql`
                subscription {
                    timeLeft {
                        timeLeft
                    }
                }`
        })
        .subscribe({
            next(response) {
                _this2.props.dispatch({
                    type:'SET_TIMELEFT',
                    data: response.data.timeLeft
                });

            },
            error(err) { console.error('Subscription error: ', err); },
        });
    }

    //Rendering functions:

    renderTabData() {
        var tabDataList = this.state.tabData.map((item) => {
            return (
            <div className="App-intro" key={(item.key)}>
            <Thumbnail
                ref={"thumbnailRef" + item.key}
                ccgOutputProps={item.key}
                ccgConnectionProps={this.ccgConnection}
                ccgStateConnectionProps={this.ccgStateConnection}
                getCcgIsUpdatedProps={this.getCcgIsUpdated.bind(this)}
                resetCcgIsUpdatedProps={this.resetCcgIsUpdated.bind(this)}
                getTabSettingsProps={this.getTabSettings.bind(this)}
            />
            </div>
            )
        })
        return (tabDataList)
    }

    render() {
        return (
        <div className="App">
            <Header />
            {this.state.showSettingsMenu ?
            <SettingsPage globalSettingsProps={this.props.store.settingsReducer[0].settings} loadSettingsProps={this.loadSettings.bind(this)} saveSettingsProps={this.saveSettings.bind(this)}/>
            : null }
            <div className="App-body">
            <Tabs
                tabs={this.state.tabData}
                onChange={(tab, index) => this.setActiveTab(index)}
            >
                {this.renderTabData()}
            </Tabs>
            </div>
        </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        store: state
    }
}

export default connect(mapStateToProps)(App);
