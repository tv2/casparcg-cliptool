import React from "react";
import { useSelector } from "react-redux";
import browserService from "../../services/browser-service";
import Output from "./output/output";
import { State } from "../../../shared/reducers/index-reducer";
import { CaspercgConfigChannel, OutputSettings } from "../../../shared/models/settings-models";

interface OutputsProps {
    outputSettings: OutputSettings[]
}

export default function Outputs(props: OutputsProps): JSX.Element {
    const ccgConfig = useSelector((state: State) => state.settings.ccgConfig)
    const folders: string[] = useSelector((state: State) => state.media.folders)
    return (
        <div>
            {browserService.isChannelView()
                ? renderSingleOutput()
                : renderMultipleOutputs()}
        </div>
    )
    
    function renderSingleOutput(): JSX.Element {
        return buildSingleOutput(
            props.outputSettings[browserService.getChannel()], 
            ccgConfig.channels[browserService.getChannel()], 
            browserService.getChannel()
        )
    }

    function renderMultipleOutputs(): JSX.Element[] {
        return ccgConfig.channels.map(
            (channel, index) => {
                const outputSettings = props.outputSettings[index]
                return buildSingleOutput(outputSettings, channel, index)
            }
        )
    }

    function buildSingleOutput(outputSettings: OutputSettings, configChannel: CaspercgConfigChannel, outputIndex: number): JSX.Element {
        return (
            <Output 
                index={outputIndex}
                configChannel={configChannel}
                outputSettings={outputSettings}
                key={outputIndex}
                folders={folders}
            />
        )
    }
}