import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../model/reducers/index-reducer";
import { OutputSettings } from "../../../model/reducers/settings-models";
import browserService from "../../services/browser-service";
import SingleOutput from "./single-output";

interface OutputsProps {
    outputSettings: OutputSettings[]
    onOutputSettingsChange: (outputSettings: OutputSettings[]) => void
}

export default function Outputs(props: OutputsProps): JSX.Element {
    const ccgConfig = useSelector((storeUpdate: State) => storeUpdate.settings.ccgConfig)    
    return (
        <div>
            {browserService.isChannelView()
                ? <SingleOutput index={browserService.getChannel() - 1} outputSettings={props.outputSettings[browserService.getChannel()]} setOutputSettings={setOutput}/>
                : ccgConfig.channels.map(
                        (item, index) => {
                            return <SingleOutput configChannel={item} index={index} outputSettings={props.outputSettings[index]} key={index} setOutputSettings={setOutput}/>
                        }
                    )}
        </div>
    )

    function setOutput(output: OutputSettings, index: number): void {
        const outputsSettingsCopy = [...props.outputSettings]
        outputsSettingsCopy[index] = output
        props.onOutputSettingsChange(outputsSettingsCopy)
    }
}