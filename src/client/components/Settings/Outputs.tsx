import React from "react";
import { useSelector } from "react-redux";
import { GenericSettings } from "../../../model/reducers/settingsModels";
import { reduxState, ReduxStateType } from "../../../model/reducers/store";
import SingleOutput from "./SingleOutput";


interface OutputsProps {
    specificChannel: number
    settings: GenericSettings
}

export default function Outputs(props: OutputsProps): JSX.Element {
    const ccgConfig = useSelector((storeUpdate: ReduxStateType) => storeUpdate.settings[0].ccgConfig)
    return (
        <div>
            {props.specificChannel
                ? <SingleOutput index={props.specificChannel - 1} output={props.settings[props.specificChannel]}/>
                : ccgConfig.channels.map(
                        (item, index) => {
                            return <SingleOutput configChannel={item} index={index} output={props.settings.outputs[index]} key={index}/>
                        }
                    )}
        </div>
    )
}