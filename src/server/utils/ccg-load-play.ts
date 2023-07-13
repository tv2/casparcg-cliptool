import { state } from '../../shared/store'
import { ccgConnection } from '../handlers/caspar-cg-handler'
import { Enum as CcgEnum } from 'casparcg-connection'
import { ReduxSettingsService } from '../../shared/services/redux-settings-service'

const reduxSettingsService = new ReduxSettingsService()

export function playMedia(
    channelIndex: number,
    layerIndex: number,
    fileName: string
): void {
    scale(channelIndex, layerIndex)
    ccgConnection.play(
        channelIndex + 1,
        layerIndex + 1,
        fileName,
        reduxSettingsService.getOutputSettings(state.settings, channelIndex)
            .loopState || false
    )
}

export function mixMedia(
    channelIndex: number,
    layerIndex: number,
    fileName: string
): void {
    scale(channelIndex, layerIndex)

    ccgConnection.play(
        channelIndex + 1,
        layerIndex + 1,
        fileName,
        reduxSettingsService.getOutputSettings(state.settings, channelIndex)
            .loopState || false,
        CcgEnum.Transition.MIX,
        reduxSettingsService.getGenericSettings(state.settings).ccgSettings
            .transitionTime
    )
}

export function loadMedia(
    channelIndex: number,
    layerIndex: number,
    fileName: string
): void {
    scale(channelIndex, layerIndex)

    ccgConnection.load(
        channelIndex + 1,
        layerIndex + 1,
        fileName,
        reduxSettingsService.getOutputSettings(state.settings, channelIndex)
            .loopState || false
    )
}

export function playOverlay(
    channelIndex: number,
    layerIndex: number,
    fileName: string
): void {
    if (!fileName) {
        return
    }
    scale(channelIndex, layerIndex)

    ccgConnection.loadHtmlPage(channelIndex + 1, layerIndex + 1, fileName)

    ccgConnection.playHtmlPage(channelIndex + 1, layerIndex + 1)
}

export function stopOverlay(channelIndex: number, layerIndex: number): void {
    ccgConnection.stop(channelIndex + 1, layerIndex + 1)
}

function scale(channelIndex: number, layerIndex: number): void {
    const videoMode = state.settings.ccgConfig.channels[channelIndex].videoMode
    if (!videoMode) {
        return
    }
    const resX = videoMode.includes('720') ? 1280 : 1920
    const resY = videoMode.includes('720') ? 720 : 1080

    let scaleOutX = 1
    let scaleOutY = 1
    const outputSetting = reduxSettingsService.getOutputSettings(
        state.settings,
        channelIndex
    )
    if (outputSetting.shouldScale) {
        scaleOutX = outputSetting.scaleX / resX
        scaleOutY = outputSetting.scaleY / resY
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
