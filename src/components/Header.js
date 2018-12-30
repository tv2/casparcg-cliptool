import React, { Component, PureComponent } from 'react';
import { connect } from "react-redux";


//Global const:
const FPS = 25;

class Header extends PureComponent {

    secondsToTimeCode(time) {
        if (time) {
            var hour = ('0' + (time/(60*60)).toFixed()).slice(-2);
            var minute = ('0' + (time/(60)).toFixed()).slice(-2);
            var sec = ('0' + time.toFixed()).slice(-2);
            var frm = ('0' + (100*(time - parseInt(time))*(FPS/100)).toFixed()).slice(-2);
        return (
            hour + "." + minute + "." + sec + "." + frm
        );
        } else {
            return "00.00.00.00";
        }
    }



    render() {
        return (
        <header className="App-header">
            <div className="App-title-background">
            <img src={this.props.store.dataReducer[0].data.activePvwPix[this.props.store.appNavReducer[0].appNav.activeTab]} className="headerPvwThumbnailImage" />
            <button className="headerPgmCounter">
                {this.secondsToTimeCode(this.props.store.dataReducer[0].data.ccgTimeLeft[this.props.store.appNavReducer[0].appNav.activeTab].timeLeft)}
            </button>
            <img src={this.props.store.dataReducer[0].data.activePgmPix[this.props.store.appNavReducer[0].appNav.activeTab]} className="headerPgmThumbnailImage" />
            </div>

            <div className="Reload-setup-background">
            <button className="App-connection-status"
                style={this.props.store.appNavReducer[0].appNav.connectionStatus ? {backgroundColor: "rgb(0, 128, 4)"} : {backgroundColor: "red"}}>
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
                style={this.props.store.settingsReducer[0].settings.tabData[this.props.store.appNavReducer[0].appNav.activeTab].loop ? {backgroundColor: 'rgb(28, 115, 165)'} : {backgroundColor: 'grey'}}
            >
                LOOP
            </button>
            <button className="autoPlay-button"
                onClick={this.handleAutoPlayStatus}
                style={this.props.store.settingsReducer[0].settings.tabData[this.props.store.appNavReducer[0].appNav.activeTab].autoPlay ? {backgroundColor: 'red'} : {backgroundColor: 'grey'}}
            >
                AUTO START
            </button>
            </div>

            <div className="mixButtonBackground">
            <a className="mixButtonText">START:</a>
            <br/>
            <button className="mixButton"
                onClick={
                    () => this.refs[("thumbnailRef" + ( this.props.store.appNavReducer[0].appNav.activeTab + 1))].pvwPlay()
                }>
                PVW
            </button>
            <button className="startButton"
                onClick={
                    () => this.refs[("thumbnailRef" + ( this.props.store.appNavReducer[0].appNav.activeTab + 1))].pgmPlay()
                }>
                PGM
            </button>
            </div>
        </header>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        store: state
    }
}

export default connect(mapStateToProps)(Header);
