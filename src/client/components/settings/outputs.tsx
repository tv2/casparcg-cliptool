import React from "react";
import { useSelector } from "react-redux";
import { GenericSettings, OutputSettings } from "../../../model/reducers/settingsModels";
import { reduxState, ReduxStateType } from "../../../model/reducers/store";
import SingleOutput from "./singleOutput";


interface OutputsProps {
    specificChannel: number
    settings: GenericSettings
    setSettings: (GenericSettings) => void
}

export default function Outputs(props: OutputsProps): JSX.Element {
    const ccgConfig = useSelector((storeUpdate: ReduxStateType) => storeUpdate.settings[0].ccgConfig)
    return (
        <div>
            {props.specificChannel
                ? <SingleOutput index={props.specificChannel - 1} output={props.settings[props.specificChannel]} setOutput={setOutput}/>
                : ccgConfig.channels.map(
                        (item, index) => {
                            return <SingleOutput configChannel={item} index={index} output={props.settings.outputs[index]} key={index} setOutput={setOutput}/>
                        }
                    )}
        </div>
    )

    function setOutput(output: OutputSettings, index: number): void {
        const settings = {...props.settings}
        const outputs = [...props.settings.outputs]
        outputs[index] = output
        settings.outputs = outputs
        props.setSettings(settings)
    }
}