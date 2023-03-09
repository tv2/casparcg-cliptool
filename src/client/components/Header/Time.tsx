import React from "react"
import { useSelector } from "react-redux"
import { IOutput } from "../../../model/reducers/mediaReducer"
import { reduxState } from "../../../model/reducers/store";
import mediaService from "../../services/mediaService";

import '../../css/App-header.css'

export default function Time() {
    const activeTab: number = useSelector(
        (storeUpdate: any) => storeUpdate.appNav[0].activeTab)
    const output: IOutput = useSelector(
        (storeUpdate: any) => storeUpdate.media[0].output[activeTab])
    useSelector(
        (storeUpdate: any) => storeUpdate.media[0].output[activeTab]?.tallyFile)
    useSelector(
        (storeUpdate: any) => storeUpdate.media[0].output[activeTab]?.time[0])
    useSelector(
        (storeUpdate: any) => storeUpdate.media[0].output[activeTab]?.thumbnailList)

    let cleanTallyFile: string = ''
    try {
        cleanTallyFile = mediaService.getCleanTallyFile(output)
    } catch {}
    const thumbnailUrl = mediaService.findThumbnail(cleanTallyFile, activeTab)
    
    return (
        <div className="App-timer-background">
            <button className="App-header-pgm-counter">
                {mediaService.secondsToTimeCode(
                    output?.time,
                    reduxState.settings[0].ccgConfig.channels[activeTab]?.videoFormat?.frameRate
                )}
            </button>
            <img
                src={thumbnailUrl}
                className="App-header-pgm-thumbnail-image"
            />
        </div>
    )
}