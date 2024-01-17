import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../../shared/reducers/index-reducer";
import { CasparcgConfigChannel, OutputState } from "../../../../shared/models/settings-models";
import { BrowserService } from "../../../shared/services/browser-service";
import Output from "../output/output";

interface OutputsFormProps {
    outputsState: OutputState[]
    onChange: (changedOutputs: OutputState[]) => void
}

export default function OutputsForm(props: OutputsFormProps): JSX.Element {
    const browserService = new BrowserService()
    const isChannelView = browserService.isChannelView()
    const casparcgConfig = useSelector((state: State) => state.settings.ccgConfig)
    const folders: string[] = useSelector((state: State) => state.media.folders)

    function onOutputChanged(changedOutput: OutputState, outputIndex: number): void {
        props.outputsState[outputIndex] = changedOutput
        props.onChange(props.outputsState)
    }

    return (
        <div>
            {
                isChannelView
                    ? renderSingleOutput(browserService, props.outputsState, casparcgConfig.channels, folders, onOutputChanged)
                    : renderMultipleOutputs(props.outputsState, casparcgConfig.channels, folders, onOutputChanged)
            }
        </div>
    )
}

function renderSingleOutput(browserService: BrowserService, outputsState: OutputState[], casparcgChannels: CasparcgConfigChannel[], folders: string[], onChange: (changedOutput: OutputState, index: number) => void ): JSX.Element {
    const channel = browserService.getChannel()
    return buildSingleOutput(
        outputsState[channel], 
        casparcgChannels[channel], 
        channel,
        folders,
        onChange
    )
}

function renderMultipleOutputs(outputsState: OutputState[], casparcgChannels: CasparcgConfigChannel[], folders: string[], onChange: (changedOutput: OutputState, index: number) => void): JSX.Element[] {
    return casparcgChannels.map(
        (channel, index) => {
            const outputSetting = outputsState[index]
            return buildSingleOutput(outputSetting, channel, index, folders, onChange)
        }
    )
}   

function buildSingleOutput(outputState: OutputState, configChannel: CasparcgConfigChannel, outputIndex: number, folders: string[], onChange: (changedOutput: OutputState, index: number) => void): JSX.Element {
    return (
        <Output 
            index={outputIndex}
            configChannel={configChannel}
            outputState={outputState}
            key={outputIndex}
            folders={folders}
            onChange={(changedOutput: OutputState) => onChange(changedOutput, outputIndex)}
        />
    )
}