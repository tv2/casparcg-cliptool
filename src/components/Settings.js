import React, { Component } from 'react';
import '../assets/css/Settings.css';

const fs = require('fs');
const electron = require('electron');
const folder = electron.remote.app.getPath('userData');
        
class SettingsPage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            settings: this.props.globalSettingsProps,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleTabDataChange = this.handleTabDataChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({settings: this.props.loadSettingsProps()});
    }

    handleChange(event) {
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy[event.target.name] = event.target.value;
        this.setState(
            {settings: settingsCopy}
        );
    }
    
    handleTabDataChange(event) {
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy.tabData[event.target.name].title = event.target.value;
        this.setState(
            {settings: settingsCopy}
        );
    }

    handleSubmit(event) {
        this.props.saveSettingsProps(this.state.settings);
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
                <label className="Settings-input-field">
                    SUBFOLDER :
                    <input name="subFolder" type="text" value={this.state.settings.subFolder} onChange={this.handleChange} />
                </label>
                <br/>
                <br/>
                <label className="Settings-input-field">
                    OUTPUT 1 :
                    <input name="0" type="text" value={this.state.settings.tabData[0].title} onChange={this.handleTabDataChange} />
                </label>
                <label className="Settings-input-field">
                    OUTPUT 2 :
                    <input name="1" type="text" value={this.state.settings.tabData[1].title} onChange={this.handleTabDataChange} />
                </label>
                <label className="Settings-input-field">
                    OUTPUT 3 :
                    <input name="2" type="text" value={this.state.settings.tabData[2].title} onChange={this.handleTabDataChange} />
                </label>
                <label className="Settings-input-field">
                    OUTPUT 4 :
                    <input name="3" type="text" value={this.state.settings.tabData[3].title} onChange={this.handleTabDataChange} />
                </label>
                <label className="Settings-input-field">
                    OUTPUT 5 :
                    <input name="4" type="text" value={this.state.settings.tabData[4].title} onChange={this.handleTabDataChange} />
                </label>
                <label className="Settings-input-field">
                    OUTPUT 6 :
                    <input name="5" type="text" value={this.state.settings.tabData[5].title} onChange={this.handleTabDataChange} />
                </label>
                <input className="Save-button" type="submit" value="SAVE SETTINGS" />
            </form>
            </div>
        );
      }
}

export default SettingsPage