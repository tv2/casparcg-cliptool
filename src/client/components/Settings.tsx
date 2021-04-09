import React from 'react';
import '../css/Settings.css';
import Select from 'react-select';
import { reduxState } from '../../model/reducers/store'


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


export const SettingsPage = () => {


    const handleChange = (event) => {
    }


    const handleTabTitle = (event) => {
        var settingsCopy= Object.assign({});
        settingsCopy.tabData[event.target.name].title = event.target.value;
    }

    const handleTabMediaFolder = (index, event) => {
    }


    const RenderOutputSettings = (index) => {
        return (
            <div className="Settings-channel-form">
                <label className="Settings-input-field">
                    OUTPUT {index+1} NAME :
                    <br/>
                    <input name={index} type="text" value={reduxState.settings[0].generic.outputLabels[index]} onChange={(event) => handleChange(event)} />
                </label>
                <label className="Settings-input-field">
                    MEDIAFOLDER :
                    <Select
                        styles={selectorColorStyles}
                        className="Settings-input-selector"
                        value={{label: 'item.subFolder', value: 'item.subFolder'}}
                        onChange={(event) => handleTabMediaFolder(index, event)}
                        options={[{value: 'VALUE', label: 'LABEL'}]}
                    />
                </label>
            </div>
        )
    }

        return (
            <div className="Settings-body">
            <p className="Settings-header">SETTINGS :</p>
            <form className="Settings-form">
                <div className="Settings-channel-form">
                    <label className="Settings-input-field">
                        IP ADDRESS :
                        <br/>
                        <input name="ipAddress" type="text" value={''} onChange={handleChange} />
                    </label>
                    <label className="Settings-input-field">
                        AMCP PORT :
                        <br/>
                        <input name="port" type="text" value={''} onChange={handleChange} />
                    </label>
                    <label className="Settings-input-field">
                        OSC PORT (into ClipTool) :
                        <br/>
                        <input name="port" type="text" value={''} onChange={handleChange} />
                    </label>
                    <label className="Settings-input-field">
                        DEFAULT LAYER :
                        <br/>
                        <input name="port" type="text" value={''} onChange={handleChange} />
                    </label>
                </div>
                <hr/>
                <div>
                    {reduxState.settings[0].ccgConfig.channels.map((index) => {
                        <RenderOutputSettings />
                    })}
                </div>
            </form>
            </div>
        );

}

