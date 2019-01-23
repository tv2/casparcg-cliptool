import React, { PureComponent } from 'react';
import {CasparCG} from 'casparcg-connection';
import { Tabs } from 'rmc-tabs';

//Apollo-Client Graphql implementation:
import gql from "graphql-tag";
import { ALL_CHANNELS_QUERY, ALL_CHANNELS_SUBSCRIPTION } from '../graphql/CasparCgQuery';

//Redux:
import { connect } from "react-redux";

// Components:
import Thumbnail from './Thumbnail';
import SettingsPage from './Settings';

//Utils:
import { saveSettings } from '../util/SettingsStorage';
import {cleanUpFilename} from '../util/filePathStringHandling';
import CcgLoadPlay from '../util/CcgLoadPlay';
import HandleAutoNext from '../util/HandleAutoNext';
import HandleOverlay from '../util/HandleOverlay';

//CSS files:
import '../assets/css/Rmc-tabs.css';
import '../assets/css/App.css';

const MIX_DURATION = 6;

class App extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            ccgIsUpdated: false,
            showSettingsMenu: false,
            tabData: []
        };

        this.checkConnectionStatus = this.checkConnectionStatus.bind(this);
        this.handleSettingsPage = this.handleSettingsPage.bind(this);
        this.handleAutoPlayStatus = this.handleAutoPlayStatus.bind(this);
        this.handleLoopStatus = this.handleLoopStatus.bind(this);
        this.ccgSubscribeTimeLeft = this.ccgSubscribeTimeLeft.bind(this);
        this.ccgSubscribeInfoData = this.ccgSubscribeInfoData.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.updatePlayingStatus = this.updatePlayingStatus.bind(this);
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        logErrorToMyService(error, info);
    }

    componentWillMount() {
        //Setup Keyboard shortcuts:
        document.addEventListener("keydown", this._handleKeyDown.bind(this));

        //Define Output Tabs:

        this.setState({tabData: this.props.store.dataReducer[0].data.channel.map((item, index) => {
            return this.props.store.settingsReducer[0].settings.tabData[index];
            })
        });
        if (this.state.tabData.length > this.props.store.dataReducer[0].data.channel.length) {
            this.state.tabData.length = this.props.store.dataReducer[0].data.channel.length;
        }

        this.ccgConnection = new CasparCG(
            {
                host: this.props.store.settingsReducer[0].settings.ipAddress,
                port: this.props.store.settingsReducer[0].settings.port,
                autoConnect: true,
            });
        this.ccgLoadPlay = new CcgLoadPlay(this.ccgConnection);
        this.handleOverlay = new HandleOverlay(this.ccgConnection);
        this.handleAutoNext = new HandleAutoNext(this.ccgLoadPlay);

        // Initialize CasparCG subscriptions:
        this.ccgSubscribeInfoData();
        this.ccgSubscribeTimeLeft();

        // Initialize timer connection status:
        var connectionTimer = setInterval(this.checkConnectionStatus, 2000);

    }

    componentDidMount() {

    }

    //Logical funtions:
    reloadPage() {
        location.reload();
    }

    checkConnectionStatus() {
        window.__APOLLO_CLIENT__.query({
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
            this.handleAutoNext.isAutoNextStopped();
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
        saveSettings(this.props.store.settingsReducer[0].settings);
    }

    handleLoopStatus() {
        this.props.dispatch({
            type:'LOOP_STATUS',
            data: this.props.store.appNavReducer[0].appNav.activeTab
        });
        saveSettings(this.props.store.settingsReducer[0].settings);
    }

    setActiveTab(tab) {
        this.props.dispatch({
            type: 'SET_ACTIVE_TAB',
            data: tab
        });
    }


    ccgSubscribeTimeLeft() {
        var _this2 = this;
        //Subscribe to CasparCG-State changes:
        window.__APOLLO_CLIENT__.subscribe({
            query: gql`
                subscription {
                    timeLeft {
                        timeLeft
                        time
                    }
                }`
        })
        .subscribe({
            next(response) {
                _this2.props.dispatch({
                    type:'SET_TIMELEFT',
                    data: response.data,
                });
                response.data.timeLeft.map((item, index) => {
                    _this2.handleAutoNext.autoNext(item, index);
                    _this2.handleOverlay.overlay(item, index);
                });
            },
            error(err) { console.error('Subscription error: ', err); },
        });
    }

    ccgSubscribeInfoData() {
        var _this2 = this;
        //Initial query channels to object:
        window.__APOLLO_CLIENT__.query({
        query: ALL_CHANNELS_QUERY
        })
        .then((response) => {
            console.log("InfoData request Data: ", response.data);
            _this2.props.dispatch({
                type:'SET_INFO_CHANNEL',
                data: response.data.channels
            });
            response.data.channels.map((item,index) => {
                _this2.updatePlayingStatus(index);
            });

            //Subscribe to CasparCG-State changes:
            window.__APOLLO_CLIENT__.subscribe({
                query: ALL_CHANNELS_SUBSCRIPTION
            })
            .subscribe({
                next(response) {
                    _this2.props.dispatch({
                        type:'SET_LAYER_10',
                        data: response.data
                    });
                    response.data.playLayer.map((item,index) => {
                        _this2.updatePlayingStatus(index);
                    });

                },
                error(err) { console.error('Subscription error: ', err); },
            });
        });
    }

    updatePlayingStatus(tab) {
        var infoStatus = this.props.store.dataReducer[0].data.ccgInfo[tab].layers[10-1];
        var fileNameFg = cleanUpFilename(infoStatus.foreground.name || '');
        var fileNameBg = cleanUpFilename(infoStatus.background.name || '');
        this.props.store.dataReducer[0].data.channel[tab].thumbList
        .map((item, index)=>{

            //Handle Foreground:
            if(item.name.includes(fileNameFg)) {
                this.props.dispatch({
                    type: 'SET_THUMB_ACTIVE_INDEX',
                    data: {
                        tab: tab,
                        thumbActiveIndex: index
                    }
                });
            }
            //Handle Background:
            if(item.name.includes(fileNameBg)) {
                this.props.dispatch({
                    type: 'SET_THUMB_ACTIVE_BG_INDEX',
                    data: {
                        tab: tab,
                        thumbActiveBgIndex: index
                    }
                });
            }
        });
    }

    //Shortcut for mix and take
    _handleKeyDown(event) {

        //TODO: Shorcut does not work after moving to App.js (still referencing to old Thumbnail)

        //Play PVW 1-4 key 1-4:
        const pvwPlay = JSON.stringify(this.props.store.appNavReducer[0].appNav.activeTab+1).charCodeAt(0);
        //Play PGM 1-4 key: QWER:
        const pgmPlay = ["Q", "W", "E", "R"][this.props.store.appNavReducer[0].appNav.activeTab].charCodeAt(0);

        switch( event.keyCode ) {
            case pvwPlay:
                this.ccgLoadPlay.playMedia(
                    10,
                    this.state.thumbActiveBgIndex,
                    this.state.thumbActiveIndex
                );
                break;
            case pgmPlay:
                this.ccgLoadPlay.playMedia(
                    10,
                    this.state.thumbActiveIndex,
                    this.state.thumbActiveBgIndex
                );
                break;
            default:
                break;
        }
    }

    //Rendering functions:

    renderHeader() {

        return (
            <header className="App-header">
                <div className="App-title-background">
                    <img src=
                        {this.props.store.dataReducer[0].data.
                            channel[this.props.store.appNavReducer[0].appNav.activeTab]
                            .thumbList[this.props.store.dataReducer[0].data.channel[this.props.store.appNavReducer[0].appNav.activeTab].thumbActiveBgIndex]
                            .thumbPix || ''
                        }
                        className="headerPvwThumbnailImage"
                        />
                    <button className="headerPgmCounter">
                        {this.props.store.dataReducer[0].data.ccgTimeCounter[this.props.store.appNavReducer[0].appNav.activeTab]}
                    </button>
                    <img src=
                        {this.props.store.dataReducer[0].data.
                            channel[this.props.store.appNavReducer[0].appNav.activeTab]
                            .thumbList[this.props.store.dataReducer[0].data.channel[this.props.store.appNavReducer[0].appNav.activeTab].thumbActiveIndex]
                            .thumbPix || ''
                        }
                        className="headerPgmThumbnailImage"
                    />
                </div>

                <div className="Reload-setup-background">
                    <button className="App-connection-status"
                        style={
                            this.props.store.appNavReducer[0].appNav.connectionStatus
                            ? {backgroundColor: "rgb(0, 128, 4)"}
                            : {backgroundColor: "red"}
                        }
                    >
                        {this.props.store.appNavReducer[0].appNav.connectionStatus ? "CONNECTED" : "CONNECTING"}
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
                        style={
                            this.props.store.settingsReducer[0].settings.tabData[this.props.store.appNavReducer[0].appNav.activeTab].loop
                            ? {backgroundColor: 'rgb(28, 115, 165)'}
                            : {backgroundColor: 'grey'}
                        }
                    >
                        LOOP
                    </button>
                    <button className="autoPlay-button"
                        onClick={this.handleAutoPlayStatus}
                        style={
                            this.props.store.settingsReducer[0].settings.tabData[this.props.store.appNavReducer[0].appNav.activeTab].autoPlay
                            ? {backgroundColor: 'red'}
                            : {backgroundColor: 'grey'}
                        }
                    >
                        AUTO NEXT
                    </button>
                </div>

                <div className="mixButtonBackground">
                    <button className="prevCueButton"
                        onClick={
                            () => this.ccgLoadPlay.prevCue(this.props.store.appNavReducer[0].appNav.activeTab + 1)
                        }
                    >
                        PREV
                    </button>
                    <button className="nextCueButton"
                        onClick={
                            () => this.ccgLoadPlay.nextCue(this.props.store.appNavReducer[0].appNav.activeTab + 1)
                        }
                    >
                        NEXT
                    </button>
                    <button className="mixButton"
                        onClick={
                            () => this.ccgLoadPlay.pvwPlay(this.props.store.appNavReducer[0].appNav.activeTab + 1)
                        }
                    >
                        MIX
                    </button>
                    <button className="startButton"
                        onClick={
                            () => this.ccgLoadPlay.pgmPlay(this.props.store.appNavReducer[0].appNav.activeTab + 1)
                        }
                    >
                        START
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
                        ccgOutputProps={item.key}
                        ccgConnectionProps={this.ccgConnection}
                        loadMediaProps={this.ccgLoadPlay.loadMedia}
                        loadBgMediaProps={this.ccgLoadPlay.loadBgMedia}
                        updatePlayingStatusProps={this.updatePlayingStatus.bind(this)}
                        handleOverlayProps={this.handleOverlay}
                    />
                </div>
            )
        })
        return (tabDataList)
    }

    render() {
        return (
        <div className="App">
            <this.renderHeader/>
            {this.state.showSettingsMenu ?
                <SettingsPage/>
                : null
            }
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
