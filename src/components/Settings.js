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
            settings: this.props.store.settingsReducer[0].settings,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleTabDataTitle = this.handleTabDataTitle.bind(this);
        this.handleTabDataFolder = this.handleTabDataFolder.bind(this);
        this.handleTabDataOverlayFolder = this.handleTabDataOverlayFolder.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleTabDataTitle(event) {
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy.tabData[event.target.name].title = event.target.value;
        this.setState(
            {settings: settingsCopy}
        );
    }

    handleTabDataFolder(event) {
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy.tabData[event.target.name].subFolder = event.target.value;
        this.setState(
            {settings: settingsCopy}
        );
    }

    handleTabDataOverlayFolder(event) {
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy.tabData[event.target.name].overlayFolder = event.target.value;
        this.setState(
            {settings: settingsCopy}
        );
    }


    handleSubmit(event) {
        saveSettings(this.state.settings);
    }

    render() {
        return (
            <div className="Settings-body">
            <p className="Settings-header">SETTINGS :</p>
            <form className="Settings-form" onSubmit={this.handleSubmit}>
                <label className="Settings-input-field">
                    IP ADDRESS :
                    <input name="ipAddress" type="text" value={this.state.settings.ipAddress} onChange={this.handleChange} />
                </label>
                <br/>
                <label className="Settings-input-field">
                    PORT :
                    <input name="port" type="text" value={this.state.settings.port} onChange={this.handleChange} />
                </label>
                <br/>
            </form>
            <form className="Settings-channel-form" onSubmit={this.handleSubmit}>
                <label className="Settings-input-field">
                    OUT 1 :
                    <input name="0" type="text" value={this.state.settings.tabData[0].title} onChange={this.handleTabDataTitle} />
                </label>
                <label className="Settings-subfolder-field">
                    SUBFOLDER :
                    <input name="0" type="text" value={this.state.settings.tabData[0].subFolder} onChange={this.handleTabDataFolder} />
                </label>
                <label className="Settings-overlayfolder-field">
                    OVERLAYFOLDER :
                    <input name="0" type="text" value={this.state.settings.tabData[0].overlayFolder} onChange={this.handleTabDataOverlayFolder} />
                </label>
                <input className="Save-button" type="submit" value="SAVE SETTINGS" />
            </form>

            <form className="Settings-channel-form" onSubmit={this.handleSubmit}>
            <label className="Settings-input-field">
                OUT 2 :
                <input name="1" type="text" value={this.state.settings.tabData[1].title} onChange={this.handleTabDataTitle} />
            </label>
            <label className="Settings-subfolder-field">
                SUBFOLDER :
                <input name="1" type="text" value={this.state.settings.tabData[1].subFolder} onChange={this.handleTabDataFolder} />
            </label>
            <label className="Settings-overlayfolder-field">
                OVERLAYFOLDER :
                <input name="1" type="text" value={this.state.settings.tabData[1].overlayFolder} onChange={this.handleTabDataOverlayFolder} />
            </label>
            </form>

            <form className="Settings-channel-form" onSubmit={this.handleSubmit}>
            <label className="Settings-input-field">
                OUT 2 :
                <input name="2" type="text" value={this.state.settings.tabData[2].title} onChange={this.handleTabDataTitle} />
            </label>
            <label className="Settings-subfolder-field">
                SUBFOLDER :
                <input name="2" type="text" value={this.state.settings.tabData[2].subFolder} onChange={this.handleTabDataFolder} />
            </label>
            <label className="Settings-overlayfolder-field">
                OVERLAYFOLDER :
                <input name="2" type="text" value={this.state.settings.tabData[2].overlayFolder} onChange={this.handleTabDataOverlayFolder} />
            </label>
            </form>

            <form className="Settings-channel-form" onSubmit={this.handleSubmit}>
            <label className="Settings-input-field">
                OUT 2 :
                <input name="3" type="text" value={this.state.settings.tabData[3].title} onChange={this.handleTabDataTitle} />
            </label>
            <label className="Settings-subfolder-field">
                SUBFOLDER :
                <input name="3" type="text" value={this.state.settings.tabData[3].subFolder} onChange={this.handleTabDataFolder} />
            </label>
            <label className="Settings-overlayfolder-field">
                OVERLAYFOLDER :
                <input name="3" type="text" value={this.state.settings.tabData[3].overlayFolder} onChange={this.handleTabDataOverlayFolder} />
            </label>
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
