import React from "react";
import { useSelector } from "react-redux";
import { State } from "../../../model/reducers/index-reducer";
import { OutputSettings } from "../../../model/reducers/settings-models";
import { state } from "../../../model/reducers/store";
import browserService from "../../services/browser-service";
import Output from "./output/output";

interface OutputsProps {
    outputSettings: OutputSettings[]
}

export default function Outputs(props: OutputsProps): JSX.Element {
    const ccgConfig = useSelector((state: State) => state.settings.ccgConfig)
    const folders: string[] = state.media.folders
    return (
        <div>
            {browserService.isChannelView()
                ? <Output index={browserService.getChannel()}
                    configChannel={state.settings.ccgConfig.channels[browserService.getChannel()]}
                    outputSettings={props.outputSettings[browserService.getChannel()]}                     
                    folders={folders}/>
                : ccgConfig.channels.map(
                        (item, index) => <Output configChannel={item}
                            index={index}
                            outputSettings={props.outputSettings[index]}
                            key={index}                            
                            folders={folders}/>
                    )}
        </div>
    )    
}