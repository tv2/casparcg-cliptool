import React, { PureComponent } from 'react'
import { Tabs } from 'rmc-tabs'
import { reduxStore, reduxState } from '../../model/reducers/store'
import * as IO from '../../model/SocketIoConstants'

//Redux:
import { connect } from 'react-redux'

// Components:
import Thumbnail from './Thumbnail'
import SettingsPage from './Settings'

//Utils:
import HandleShortcuts from '../util/HandleShortcuts'

//CSS files:
import '../css/Rmc-tabs.css'
import '../css/App.css'
import '../css/App-header.css'
import '../css/App-control-view-header.css'
import '../css/App-text-view-header.css'
import { socket } from '../util/SocketClientHandlers'

const MIX_DURATION = 6

class App extends PureComponent {
    handleShortcuts: any
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
        let tabs = [
            { key: 'a', title: 'Ch 1' },
            { key: 'b', title: 'Ch 2' },
        ]
        /*
        reduxState.channels[0].map((item, index) => {
            return reduxState.settings[0].tabData[index]
        })
        */
        //Hide Tabs with no name:
        tabs = tabs.filter((item) => {
            return item.title != ''
        })
        this.setState({ tabData: tabs })

        // this.handleShortcuts = new HandleShortcuts()
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
        let { appNav, settings } = reduxState

        return (
            <header className="App-header">
                <div className="App-title-background">
                    <img src={''} className="App-header-pvw-thumbnail-image" />
                    <button className="App-header-pgm-counter"></button>
                    <img src={''} className="App-header-pgm-thumbnail-image" />
                </div>

                <div className="App-reload-setup-background">
                    <button
                        className="App-connection-status"
                        onClick={() => this.handleSelectView()}
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
                        onClick={() => this.handleSettingsPage()}
                    >
                        SETTINGS
                    </button>
                    <button
                        className="App-reload-button"
                        onClick={() => this.reloadPage()}
                    >
                        RELOAD
                    </button>
                </div>

                <div className="App-loop-autoPlay-background">
                    <button
                        className="App-loop-button"
                        onClick={() => this.handleLoopStatus()}
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
                        onClick={() => this.handleAutoPlayStatus()}
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
                            socket.emit(IO.CUE_PREV, appNav[0].activeTab + 1)
                        }
                    >
                        PREV
                    </button>
                    <button
                        className="App-next-cue-button"
                        onClick={() =>
                            socket.emit(IO.CUE_NEXT, appNav[0].activeTab + 1)
                        }
                    >
                        NEXT
                    </button>
                    <button
                        className="App-mix-button"
                        onClick={() =>
                            socket.emit(IO.PWV_PLAY, appNav[0].activeTab + 1)
                        }
                    >
                        MIX
                    </button>
                    <button
                        className="App-start-button"
                        onClick={() =>
                            socket.emit(IO.PGM_PLAY, appNav[0].activeTab + 1)
                        }
                    >
                        START
                    </button>
                </div>
            </header>
        )
    }

    renderControlHeader() {
        let { appNav, channels, settings } = reduxState

        return (
            <header className="App-control-view-header">
                <div className="App-control-view-title-background">
                    <img
                        src={''}
                        className="App-control-view-header-pvw-thumbnail-image"
                    />
                    <div className="App-control-view-header-title">{''}</div>
                    <img
                        src={''}
                        className="App-control-view-header-pgm-thumbnail-image"
                    />
                    <button className="App-control-view-header-pgm-counter"></button>
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
                            socket.emit(IO.CUE_PREV, appNav[0].activeTab + 1)
                        }
                    >
                        PREV
                    </button>
                    <button
                        className="App-control-view-next-cue-button"
                        onClick={() =>
                            socket.emit(IO.CUE_NEXT, appNav[0].activeTab + 1)
                        }
                    >
                        NEXT
                    </button>
                    <button
                        className="App-control-view-mix-button"
                        onClick={() =>
                            socket.emit(IO.PWV_PLAY, appNav[0].activeTab + 1)
                        }
                    >
                        MIX
                    </button>
                    <button
                        className="App-control-view-start-button"
                        onClick={() =>
                            socket.emit(IO.PGM_PLAY, appNav[0].activeTab + 1)
                        }
                    >
                        START
                    </button>
                </div>
            </header>
        )
    }

    renderTextViewHeader() {
        let { appNav, channels } = reduxState

        return (
            <header className="App-text-view-header">
                <div className="App-text-view-title-background">
                    <img
                        src={''}
                        className="App-text-view-header-pgm-thumbnail-image"
                    />
                    <button className="App-text-view-header-pgm-counter"></button>
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
                            socket.emit(IO.PGM_PLAY, appNav[0].activeTab + 1)
                        }
                    >
                        START
                    </button>
                </div>
            </header>
        )
    }

    renderTabData() {
        return this.state.tabData.map((item) => {
            return (
                <div className="App-intro" key={item.key}>
                    <Thumbnail />
                </div>
            )
        })
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
                    <Tabs tabs={this.state.tabData} onChange={(tab, index) => this.setActiveTab(index)}>
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
