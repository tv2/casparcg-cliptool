import React, { Component } from 'react';
import '../assets/css/Settings.css';

//Redux:
import { connect } from "react-redux";

//Utils:
import { saveSettings } from '../util/SettingsStorage';

class SettingsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            settings: this.props.store.settings[0],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleTabTitle = this.handleTabTitle.bind(this);
        this.handleTabMediaFolder = this.handleTabMediaFolder.bind(this);
        this.handleTabDataFolder = this.handleTabDataFolder.bind(this);
        this.handleTabOverlayFolder = this.handleTabOverlayFolder.bind(this);
        this.handleTabWipe = this.handleTabWipe.bind(this);
        this.handleTabWipeOffset = this.handleTabWipeOffset.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderChannelSettings = this.renderChannelSettings.bind(this);
    }

    componentDidMount() {
    }

    handleChange(event) {
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy[event.target.name] = event.target.value;
        this.setState(
            {settings: settingsCopy}
        );
    }

    handleTabTitle(event) {
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy.tabData[event.target.name].title = event.target.value;
        this.setState(
            {settings: settingsCopy}
        );
    }

    handleTabMediaFolder(event) {
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy.tabData[event.target.name].subFolder = event.target.value;
        this.setState(
            {settings: settingsCopy}
        );
    }


    handleTabDataFolder(event) {
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy.tabData[event.target.name].dataFolder = event.target.value;
        this.setState(
            {settings: settingsCopy}
        );
    }

    handleTabOverlayFolder(event) {
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy.tabData[event.target.name].overlayFolder = event.target.value;
        this.setState(
            {settings: settingsCopy}
        );
    }

    handleTabWipe(event) {
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy.tabData[event.target.name].wipe = event.target.value;
        this.setState(
            {settings: settingsCopy}
        );
    }


    handleTabWipeOffset(event) {
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy.tabData[event.target.name].wipeOffset = event.target.value;
        this.setState(
            {settings: settingsCopy}
        );
    }

    handleSubmit(event) {
        saveSettings(this.state.settings);
    }

    renderChannelSettings(item, index) {
        return (
            <div className="Settings-channel-form" onSubmit={this.handleSubmit}>
                <label className="Settings-input-field">
                    OUT {index+1} :
                    <input name={index} type="text" value={item.title} onChange={this.handleTabTitle} />
                </label>
                <label className="Settings-input-field">
                    MEDIAFOLDER :
                    <input name={index} type="text" value={item.subFolder} onChange={this.handleTabMediaFolder} />
                </label>
                <label className="Settings-input-field">
                    DATAFOLDER :
                    <input name={index} type="text" value={item.dataFolder} onChange={this.handleTabDataFolder} />
                </label>
                <label className="Settings-input-field">
                    TEMPLATEFOLDER :
                    <input name={index} type="text" value={item.overlayFolder} onChange={this.handleTabOverlayFolder} />
                </label>
                <label className="Settings-input-field">
                    WIPE :
                    <input name={index} type="text" value={item.wipe} onChange={this.handleTabWipe} />
                </label>
                <label className="Settings-input-field">
                    WIPE OFFSET :
                    <input name={index} type="text" value={item.wipeOffset} onChange={this.handleTabWipeOffset} />
                </label>
            </div>
        )
    }

    render() {
        return (
            <div className="Settings-body">
            <p className="Settings-header">SETTINGS :</p>
            <form className="Settings-form" onSubmit={this.handleSubmit}>
                <div className="Settings-channel-form">
                <label className="Settings-input-field">
                    IP ADDRESS :
                    <input name="ipAddress" type="text" value={this.state.settings.ipAddress} onChange={this.handleChange} />
                </label>
                <label className="Settings-input-field">
                    PORT :
                    <input name="port" type="text" value={this.state.settings.port} onChange={this.handleChange} />
                </label>
                <br/>
                <label className="Settings-input-field">
                    MINIVIEW :
                    <input name="miniView" type="checkbox" value={this.state.settings.miniView} onChange={this.handleChange} />
                </label>                      
                </div>

                <br/>
                {this.renderChannelSettings(this.state.settings.tabData[0], 0)}
                {this.renderChannelSettings(this.state.settings.tabData[1], 1)}
                {this.renderChannelSettings(this.state.settings.tabData[2], 2)}
                {this.renderChannelSettings(this.state.settings.tabData[3], 3)}
                <input className="Save-button" type="submit" value="SAVE SETTINGS" />
            </form>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        store: state
    }
}

export default connect(mapStateToProps)(SettingsPage);
