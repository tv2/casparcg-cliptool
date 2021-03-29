import React, { PureComponent } from 'react'
// import { CasparCG, IConnectionOptions } from 'casparcg-connection'
import { Tabs } from 'rmc-tabs'
import { reduxStore, reduxState } from '../../model/reducers/store'

//Redux:
import { connect } from 'react-redux'

// Components:
import Thumbnail from './Thumbnail'
import SettingsPage from './Settings'

//Utils:
import CcgLoadPlay from '../util/CcgLoadPlay'
import HandleAutoNext from '../util/HandleAutoNext'
import HandleOverlay from '../util/HandleOverlay'
import HandleShortcuts from '../util/HandleShortcuts'
import LoadThumbs from '../util/LoadThumbs'

//CSS files:
import '../css/Rmc-tabs.css'
import '../css/App.css'
import '../css/App-header.css'
import '../css/App-control-view-header.css'
import '../css/App-text-view-header.css'

const MIX_DURATION = 6

class App extends PureComponent {
    ccgConnection: any
    ccgLoadPlay: any
    handleOverlay: any
    handleAutoNext: any
    handleShortcuts: any
    loadThumbs: any
    state: any

    constructor(props) {
        super(props)

        this.state = {
            ccgIsUpdated: false,
            tabData: [],
        }

        //BINDS:
        this.handleSettingsPage = this.handleSettingsPage.bind(this)
        this.handleSelectView = this.handleSelectView.bind(this)
        this.handleAutoPlayStatus = this.handleAutoPlayStatus.bind(this)
        this.handleLoopStatus = this.handleLoopStatus.bind(this)
    }

    componentWillMount() {
        //Define Output Tabs:
        let tabs = reduxState.data[0].channel.map((item, index) => {
            return reduxState.settings[0].tabData[index]
        })
        //Hide Tabs with no name:
        tabs = tabs.filter((item) => {
            return item.title != ''
        })
        this.setState({ tabData: tabs })
/*
        const connectionOptions: IConnectionOptions = {
            host: reduxState.settings[0].ipAddress,
            port: parseInt(reduxState.settings[0].port),
            autoConnect: true,
        }
        this.ccgConnection = new CasparCG(connectionOptions)
*/
        this.ccgConnection.infoPaths().then((response) => {
            console.log('List of paths : ', response)
        })

        // loadClipToolCommonSettings(this.ccgConnection, state.settings, state.appNav[0].showSettingsActive);
        this.ccgLoadPlay = new CcgLoadPlay(this.ccgConnection)
        this.handleOverlay = new HandleOverlay(this.ccgConnection)
        this.handleAutoNext = new HandleAutoNext(this.ccgLoadPlay)
        this.handleShortcuts = new HandleShortcuts(this.ccgLoadPlay)
        this.loadThumbs = new LoadThumbs(this.ccgConnection)
    }

    //Logical funtions:
    reloadPage() {
        location.reload()
    }

    //Handler functions:
    handleSettingsPage() {
        reduxStore.dispatch({
            type: 'TOGGLE_SHOW_SETTINGS',
        })
    }

    handleAutoPlayStatus() {
        reduxStore.dispatch({
            type: 'AUTOPLAY_STATUS',
            data: reduxState.appNav[0].activeTab,
        })
        // saveSettings(state.settings[0], this.ccgConnection)
    }

    handleSelectView() {
        if (reduxState.appNav[0].showSettingsActive) {
            this.handleSettingsPage()
            return
        }
        reduxStore.dispatch({
            type: 'TOGGLE_VIEW',
        })
        // saveSettings(state.settings[0], this.ccgConnection)
    }

    handleLoopStatus() {
        reduxStore.dispatch({
            type: 'LOOP_STATUS',
            data: reduxState.appNav[0].activeTab,
        })
        // saveSettings(state.settings[0], this.ccgConnection)
    }

    setActiveTab(tab) {
        reduxStore.dispatch({
            type: 'SET_ACTIVE_TAB',
            data: tab,
        })
    }

    //Rendering functions:

    renderFullHeader() {
        let { appNav, data, settings } = reduxState

        return (
            <header className="App-header">
                <div className="App-title-background">
                    <img
                        src={
                            data[0].channel[appNav[0].activeTab].thumbList[
                                data[0].channel[appNav[0].activeTab]
                                    .thumbActiveBgIndex
                            ].thumbPix || ''
                        }
                        className="App-header-pvw-thumbnail-image"
                    />
                    <button className="App-header-pgm-counter">
                        {data[0].ccgTimeCounter[appNav[0].activeTab]}
                    </button>
                    <img
                        src={
                            data[0].channel[appNav[0].activeTab].thumbList[
                                data[0].channel[appNav[0].activeTab]
                                    .thumbActiveIndex
                            ].thumbPix || ''
                        }
                        className="App-header-pgm-thumbnail-image"
                    />
                </div>

                <div className="App-reload-setup-background">
                    <button
                        className="App-connection-status"
                        onClick={this.handleSelectView}
                        style={
                            appNav[0].connectionStatus
                                ? { backgroundColor: 'rgb(0, 128, 4)' }
                                : { backgroundColor: 'red' }
                        }
                    >
                        {appNav[0].connectionStatus ? 'VIEW' : 'CONNECTING'}
                    </button>
                    <button
                        className="App-settings-button"
                        onClick={this.handleSettingsPage}
                    >
                        SETTINGS
                    </button>
                    <button
                        className="App-reload-button"
                        onClick={this.reloadPage}
                    >
                        RELOAD
                    </button>
                </div>

                <div className="App-loop-autoPlay-background">
                    <button
                        className="App-loop-button"
                        onClick={this.handleLoopStatus}
                        style={
                            settings[0].tabData[appNav[0].activeTab].loop
                                ? { backgroundColor: 'rgb(28, 115, 165)' }
                                : { backgroundColor: 'grey' }
                        }
                    >
                        LOOP
                    </button>
                    <button
                        className="App-autoPlay-button"
                        onClick={this.handleAutoPlayStatus}
                        style={
                            settings[0].tabData[appNav[0].activeTab].autoPlay
                                ? { backgroundColor: 'red' }
                                : { backgroundColor: 'grey' }
                        }
                    >
                        AUTO NEXT
                    </button>
                </div>

                <div className="App-mix-button-background">
                    <button
                        className="App-prev-cue-button"
                        onClick={() =>
                            this.ccgLoadPlay.prevCue(appNav[0].activeTab + 1)
                        }
                    >
                        PREV
                    </button>
                    <button
                        className="App-next-cue-button"
                        onClick={() =>
                            this.ccgLoadPlay.nextCue(appNav[0].activeTab + 1)
                        }
                    >
                        NEXT
                    </button>
                    <button
                        className="App-mix-button"
                        onClick={() =>
                            this.ccgLoadPlay.pvwPlay(appNav[0].activeTab + 1)
                        }
                    >
                        MIX
                    </button>
                    <button
                        className="App-start-button"
                        onClick={() =>
                            this.ccgLoadPlay.pgmPlay(appNav[0].activeTab + 1)
                        }
                    >
                        START
                    </button>
                </div>
            </header>
        )
    }

    renderControlHeader() {
        let { appNav, data, settings } = reduxState

        return (
            <header className="App-control-view-header">
                <div className="App-control-view-title-background">
                    <img
                        src={
                            data[0].channel[appNav[0].activeTab].thumbList[
                                data[0].channel[appNav[0].activeTab]
                                    .thumbActiveBgIndex
                            ].thumbPix || ''
                        }
                        className="App-control-view-header-pvw-thumbnail-image"
                    />
                    <div className="App-control-view-header-title">
                        {data[0].channel[appNav[0].activeTab].thumbList[
                            data[0].channel[appNav[0].activeTab]
                                .thumbActiveIndex
                        ].name || ''}
                    </div>
                    <img
                        src={
                            data[0].channel[appNav[0].activeTab].thumbList[
                                data[0].channel[appNav[0].activeTab]
                                    .thumbActiveIndex
                            ].thumbPix || ''
                        }
                        className="App-control-view-header-pgm-thumbnail-image"
                    />
                    <button className="App-control-view-header-pgm-counter">
                        {data[0].ccgTimeCounter[appNav[0].activeTab]}
                    </button>
                </div>

                <div className="App-control-view-reload-setup-background">
                    <button
                        className="App-control-view-connection-status"
                        onClick={this.handleSelectView}
                        style={
                            appNav[0].connectionStatus
                                ? { backgroundColor: 'rgb(0, 128, 4)' }
                                : { backgroundColor: 'red' }
                        }
                    >
                        {appNav[0].connectionStatus ? 'VIEW' : 'CONNECTING'}
                    </button>
                    <button
                        className="App-control-view-reload-button"
                        onClick={this.reloadPage}
                    >
                        RELOAD
                    </button>
                </div>

                <div className="App-control-view-loop-autoPlay-background">
                    <button
                        className="App-control-view-loop-button"
                        onClick={this.handleLoopStatus}
                        style={
                            settings[0].tabData[appNav[0].activeTab].loop
                                ? { backgroundColor: 'rgb(28, 115, 165)' }
                                : { backgroundColor: 'grey' }
                        }
                    >
                        LOOP
                    </button>
                    <button
                        className="App-control-view-autoPlay-button"
                        onClick={this.handleAutoPlayStatus}
                        style={
                            settings[0].tabData[appNav[0].activeTab].autoPlay
                                ? { backgroundColor: 'red' }
                                : { backgroundColor: 'grey' }
                        }
                    >
                        AUTO NEXT
                    </button>
                </div>

                <div className="App-control-view-mix-button-background">
                    <button
                        className="App-control-view-prev-cue-button"
                        onClick={() =>
                            this.ccgLoadPlay.prevCue(appNav[0].activeTab + 1)
                        }
                    >
                        PREV
                    </button>
                    <button
                        className="App-control-view-next-cue-button"
                        onClick={() =>
                            this.ccgLoadPlay.nextCue(appNav[0].activeTab + 1)
                        }
                    >
                        NEXT
                    </button>
                    <button
                        className="App-control-view-mix-button"
                        onClick={() =>
                            this.ccgLoadPlay.pvwPlay(appNav[0].activeTab + 1)
                        }
                    >
                        MIX
                    </button>
                    <button
                        className="App-control-view-start-button"
                        onClick={() =>
                            this.ccgLoadPlay.pgmPlay(appNav[0].activeTab + 1)
                        }
                    >
                        START
                    </button>
                </div>
            </header>
        )
    }

    renderTextViewHeader() {
        let { appNav, data } = reduxState

        return (
            <header className="App-text-view-header">
                <div className="App-text-view-title-background">
                    <img
                        src={
                            data[0].channel[appNav[0].activeTab].thumbList[
                                data[0].channel[appNav[0].activeTab]
                                    .thumbActiveIndex
                            ].thumbPix || ''
                        }
                        className="App-text-view-header-pgm-thumbnail-image"
                    />
                    <button className="App-text-view-header-pgm-counter">
                        {data[0].ccgTimeCounter[appNav[0].activeTab]}
                    </button>
                </div>

                <div className="App-text-view-reload-setup-background">
                    <button
                        className="App-text-view-connection-status"
                        onClick={this.handleSelectView}
                        style={
                            appNav[0].connectionStatus
                                ? { backgroundColor: 'rgb(0, 128, 4)' }
                                : { backgroundColor: 'red' }
                        }
                    >
                        {appNav[0].connectionStatus ? 'VIEW' : 'CONNECTING'}
                    </button>
                    <button
                        className="App-text-view-reload-button"
                        onClick={this.reloadPage}
                    >
                        RELOAD
                    </button>
                </div>

                <div className="App-text-view-mix-button-background">
                    <button
                        className="App-text-view-start-button"
                        onClick={() =>
                            this.ccgLoadPlay.pgmPlay(appNav[0].activeTab + 1)
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
                <div className="App-intro" key={item.key}>
                    <Thumbnail />
                </div>
            )
        })
        return tabDataList
    }

    render() {
        return (
            <div className="App">
                {reduxState.settings[0].selectView === 0 ? (
                    <this.renderFullHeader />
                ) : (
                    ''
                )}
                {reduxState.settings[0].selectView === 1 ? (
                    <this.renderTextViewHeader />
                ) : (
                    ''
                )}
                {reduxState.settings[0].selectView === 2 ? (
                    <this.renderControlHeader />
                ) : (
                    ''
                )}
                {reduxState.appNav[0].showSettingsActive ? (
                    <SettingsPage />
                ) : null}
                <div className="App-body">
                    <Tabs onChange={(tab, index) => this.setActiveTab(index)}>
                        {this.renderTabData()}
                    </Tabs>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        store: state,
    }
}

export default connect(mapStateToProps)(App)
