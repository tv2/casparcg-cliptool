const MIX_DURATION = 6
import { reduxState } from '../../model/reducers/store'
import { ccgConnection } from '../handlers/CasparCgHandler'

export const playMedia = (
    channelIndex: number,
    layerIndex: number,
    fileName: string
) => {
    console.log('Loop :', reduxState.media[0].loop[channelIndex] || false)
    ccgConnection.play(
        channelIndex,
        layerIndex + 1,
        fileName,
        reduxState.media[0].loop[channelIndex] || false
    )
}
