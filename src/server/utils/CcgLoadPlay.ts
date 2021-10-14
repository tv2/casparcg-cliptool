const MIX_DURATION = 16
import { reduxState } from '../../model/reducers/store'
import { ccgConnection } from '../handlers/CasparCgHandler'
import { Enum as CcgEnum } from 'casparcg-connection'

export const playMedia = (
    channelIndex: number,
    layerIndex: number,
    fileName: string
) => {
    scale(channelIndex, layerIndex)
    ccgConnection.play(
        channelIndex + 1,
        layerIndex + 1,
        fileName,
        reduxState.media[0].output[channelIndex].loopState || false
    )
}

export const mixMedia = (
    channelIndex: number,
    layerIndex: number,
    fileName: string
) => {
    scale(channelIndex, layerIndex)

    ccgConnection.play(
        channelIndex + 1,
        layerIndex + 1,
        fileName,
        reduxState.media[0].output[channelIndex].loopState || false,
        CcgEnum.Transition.MIX,
        MIX_DURATION
    )
}

export const loadMedia = (
    channelIndex: number,
    layerIndex: number,
    fileName: string
) => {
    scale(channelIndex, layerIndex)

    ccgConnection.load(
        channelIndex + 1,
        layerIndex + 1,
        fileName,
        reduxState.media[0].output[channelIndex].loopState || false
    )
}

const scale = (channelIndex: number, layerIndex: number) => {
    let resX = reduxState.settings[0].ccgConfig.channels[
        channelIndex
    ].videoMode.includes('720')
        ? 1280
        : 1920
    let resY = reduxState.settings[0].ccgConfig.channels[
        channelIndex
    ].videoMode.includes('720')
        ? 720
        : 1080

    let scaleOutX = 1
    let scaleOutY = 1
    if (reduxState.settings[0].generics.scale[channelIndex]) {
        scaleOutX = reduxState.settings[0].generics.scaleX[channelIndex] / resX
        scaleOutY = reduxState.settings[0].generics.scaleY[channelIndex] / resY
    }

    ccgConnection.mixerFill(
        channelIndex + 1,
        layerIndex + 1,
        0,
        0,
        scaleOutX,
        scaleOutY,
        1
    )
}
