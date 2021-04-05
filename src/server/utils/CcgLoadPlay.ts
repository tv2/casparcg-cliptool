const MIX_DURATION = 6
import { reduxStore, reduxState } from '../../model/reducers/store'
import { ccgConnection } from '../handlers/CasparCgHandler'

export const playMedia = (
    channelIndex: number,
    layerIndex: number,
    fileName: string
) => {
    ccgConnection.play(
        channelIndex,
        layerIndex + 1,
        fileName,
        reduxState.channels[0][channelIndex].layer[9].foreground.loop
    )
}
