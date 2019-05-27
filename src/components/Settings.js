import React, { Component } from 'react';
import '../assets/css/Settings.css';
import Select from 'react-select';


//Redux:
import { connect } from "react-redux";

//Utils:
import { saveSettings } from '../util/SettingsStorage';

//Set style for Select dropdown component:
const selectorColorStyles = {
    control: styles => ({ ...styles, backgroundColor: '#676767', color: 'white', border: 0 }),
    option: (styles) => {
        return {
            backgroundColor: '#AAAAAA',
            color: 'white'
        };
    },
    singleValue: styles => ({ ...styles, color: 'white' }),
};


class SettingsPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            settings: this.props.store.settings[0],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleDisableDragNDrop = this.handleDisableDragNDrop.bind(this);
        this.handleDisableOverlay = this.handleDisableOverlay.bind(this);
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

    handleDisableDragNDrop(event) {
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy.disableDragNDrop = event.target.checked;
        this.setState(
            {settings: settingsCopy}
        );
    }

    handleDisableOverlay(event) {
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy.disableOverlay = event.target.checked;
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

    handleTabMediaFolder(index, event) {
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy.tabData[index].subFolder = event.value + "/";
        this.setState(
            {settings: settingsCopy}
        );
    }


    handleTabDataFolder(index, event) {
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy.tabData[index].dataFolder = event.value  + "/";
        this.setState(
            {settings: settingsCopy}
        );
    }

    handleTabOverlayFolder(index, event) {
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy.tabData[index].overlayFolder = event.value  + "/";
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
        saveSettings(this.state.settings, this.props.ccgConnectionProps);
    }

    renderChannelSettings(item, index) {
        return (
            <div className="Settings-channel-form" onSubmit={this.handleSubmit}>
                <label className="Settings-input-field">
                    OUT {index+1} NAME :
                    <br/>
                    <input name={index} type="text" value={item.title} onChange={this.handleTabTitle} />
                </label>
                <label className="Settings-input-field">
                    MEDIAFOLDER :
                    <Select
                        styles={selectorColorStyles}
                        className="Settings-input-selector"
                        value={{label: item.subFolder, value: item.subFolder}}
                        onChange={(event) => this.handleTabMediaFolder(index, event)}
                        options={this.props.mediaFoldersProps}
                    />
                </label>
                <label className="Settings-input-field">
                    DATAFOLDER :
                    <Select
                        styles={selectorColorStyles}
                        className="Settings-input-selector"
                        value={{label: item.dataFolder, value: item.dataFolder}}
                        onChange={(event) => this.handleTabDataFolder(index, event)}
                        options={this.props.dataFoldersProps}
                    />
                </label>
                <label className="Settings-input-field">
                    TEMPLATEFOLDER :
                    <Select
                        styles={selectorColorStyles}
                        className="Settings-input-selector"
                        value={{label: item.overlayFolder, value: item.overlayFolder}}
                        onChange={(event) => this.handleTabOverlayFolder(index, event)}
                        options={this.props.templateFoldersProps}
                    />
                </label>
                <label className="Settings-input-field">
                    WIPE :
                    <br/>
                    <input name={index} type="text" value={item.wipe} onChange={this.handleTabWipe} />
                </label>
                <label className="Settings-input-field">
                    WIPE OFFSET :
                    <br/>
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
                        <br/>
                        <input name="ipAddress" type="text" value={this.state.settings.ipAddress} onChange={this.handleChange} />
                    </label>
                    <label className="Settings-input-field">
                        PORT :
                        <br/>
                        <input name="port" type="text" value={this.state.settings.port} onChange={this.handleChange} />
                    </label>
                    <label className="Settings-input-field">
                        DISABLE DRAG´N´DROP :
                        <br/>
                        <input type="checkbox" checked={this.state.settings.disableDragNDrop} onChange={this.handleDisableDragNDrop} />
                    </label>
                    <label className="Settings-input-field">
                    CLIPTOOL ONLY :
                    <br/>
                    <input type="checkbox" checked={this.state.settings.disableOverlay} onChange={this.handleDisableOverlay} />
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
