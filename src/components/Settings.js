import React, { Component } from 'react';
import '../assets/css/Settings.css';

class SettingsPage extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            settings: {
                ipAddress: 'localhost',
                port: '5250',
                subFolder: '',
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(event) {
        console.log(event.target.name + " : " +event.target.value);
        var settingsCopy= Object.assign({}, this.state.settings);
        settingsCopy[event.target.name] = event.target.value;

        this.setState(
            {settings: settingsCopy}
        );
    }
    
    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.ipAddress);
        event.preventDefault();
    }
    
    render() {
        return (
            <form className="Settings-body" onSubmit={this.handleSubmit}>
                <label>
                    IP Address:
                    <input name="ipAddress" type="text" value={this.state.settings.ipAddress} onChange={this.handleChange} />
                </label>
                <br/>
                <label>
                    PORT:
                    <input name="port" type="text" value={this.state.settings.port} onChange={this.handleChange} />
                </label>
                <br/>
                <label>
                    Subfolder:
                    <input name="subFolder" type="text" value={this.state.settings.subFolder} onChange={this.handleChange} />
                </label>
                <br/>
                <input type="submit" value="Submit" />
            </form>
        );
      }
}

export default SettingsPage