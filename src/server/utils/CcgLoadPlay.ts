const MIX_DURATION = 16
import { reduxState } from '../../model/reducers/store'
import { ccgConnection } from '../handlers/CasparCgHandler'
import { Enum as CcgEnum } from 'casparcg-connection'

export const playMedia = (
    channelIndex: number,
    layerIndex: number,
    fileName: string
) => {
    ccgConnection.play(
        channelIndex,
        layerIndex + 1,
        fileName,
        reduxState.media[0].loopState[channelIndex] || false
    )
}

export const mixMedia = (
    channelIndex: number,
    layerIndex: number,
    fileName: string
) => {
    ccgConnection.play(
        channelIndex,
        layerIndex + 1,
        fileName,
        reduxState.media[0].loopState[channelIndex] || false,
        CcgEnum.Transition.MIX,
        MIX_DURATION
    )
}

export const loadMedia = (
    channelIndex: number,
    layerIndex: number,
    fileName: string
) => {
    ccgConnection.load(
        channelIndex,
        layerIndex + 1,
        fileName,
        reduxState.media[0].loopState[channelIndex] || false
    )
}
