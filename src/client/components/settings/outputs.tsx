import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../model/reducers/index-reducer";
import { OutputSettings } from "../../../model/reducers/settings-models";
import { state } from "../../../model/reducers/store";
import browserService from "../../services/browser-service";
import Output from "./output/output";

interface OutputsProps {
    outputSettings: OutputSettings[]
    onOutputSettingsChange: (outputSettings: OutputSettings[]) => void
}

export default function Outputs(props: OutputsProps): JSX.Element {
    const ccgConfig = useSelector((state: State) => state.settings.ccgConfig)
    const folders: string[] = state.media.folders
    return (
        <div>
            {browserService.isChannelView()
                ? <Output index={browserService.getChannel() - 1}
                    configChannel={state.settings.ccgConfig.channels[browserService.getChannel() - 1]}
                    outputSettings={props.outputSettings[browserService.getChannel()]} 
                    setOutputSettings={setOutput}
                    folders={folders}/>
                : ccgConfig.channels.map(
                        (item, index) => <Output configChannel={item}
                            index={index}
                            outputSettings={props.outputSettings[index]}
                            key={index}
                            setOutputSettings={setOutput} 
                            folders={folders}/>
                    )}
        </div>
    )

    function setOutput(output: OutputSettings, index: number): void {
        const outputsSettingsCopy = [...props.outputSettings]
        outputsSettingsCopy[index] = output
        props.onOutputSettingsChange(outputsSettingsCopy)
    }
}