import { ReduxSettingsService } from '../../shared/services/redux-settings-service'
import { state } from '../../shared/store'
import { Enum as CcgEnum } from 'casparcg-connection/dist/lib/ServerStateEnum'
import { CasparCG } from 'casparcg-connection'

export class CasparCgPlayoutService {
    private readonly reduxSettingsService: ReduxSettingsService
    private readonly casparCgConnection: CasparCG

    public constructor(casparCgConnection: CasparCG) {
        this.reduxSettingsService = new ReduxSettingsService()
        this.casparCgConnection = casparCgConnection
    }

    public async playMedia(
        channelIndex: number,
        layerIndex: number,
        fileName: string
    ): Promise<void> {
        await this.scale(channelIndex, layerIndex)
        await this.executePlayMedia(channelIndex, layerIndex, fileName)
    }

    public async mixMedia(
        channelIndex: number,
        layerIndex: number,
        fileName: string
    ): Promise<void> {
        await this.scale(channelIndex, layerIndex)
        const transitionTime = this.reduxSettingsService.getGenericSettings(
            state.settings
        ).ccgSettings.transitionTime
        await this.executePlayMedia(
            channelIndex,
            layerIndex,
            fileName,
            CcgEnum.Transition.MIX,
            transitionTime
        )
    }

    private async executePlayMedia(
        channelIndex: number,
        layerIndex: number,
        fileName: string,
        transitionType: CcgEnum.Transition = CcgEnum.Transition.CUT,
        transitionTime: number = 0
    ): Promise<void> {
        const loopState = this.getLoopState(channelIndex)
        await this.casparCgConnection.play(
            channelIndex + 1,
            layerIndex + 1,
            fileName,
            loopState,
            transitionType,
            transitionTime
        )
    }

    private getLoopState(channelIndex: number): boolean {
        return (
            this.reduxSettingsService.getOutputSettings(
                state.settings,
                channelIndex
            ).loopState || false
        )
    }

    public async loadMedia(
        channelIndex: number,
        layerIndex: number,
        fileName: string
    ): Promise<void> {
        await this.scale(channelIndex, layerIndex)
        const loopState = this.getLoopState(channelIndex)
        await this.casparCgConnection.load(
            channelIndex + 1,
            layerIndex + 1,
            fileName,
            loopState
        )
    }

    public async playOverlay(
        channelIndex: number,
        layerIndex: number,
        fileName: string
    ): Promise<void> {
        if (!fileName) {
            return
        }
        await this.scale(channelIndex, layerIndex)

        await this.casparCgConnection.loadHtmlPage(
            channelIndex + 1,
            layerIndex + 1,
            fileName
        )

        await this.casparCgConnection.playHtmlPage(
            channelIndex + 1,
            layerIndex + 1
        )
    }

    public async stopOverlay(
        channelIndex: number,
        layerIndex: number
    ): Promise<void> {
        await this.casparCgConnection.stop(channelIndex + 1, layerIndex + 1)
    }

    private async scale(
        channelIndex: number,
        layerIndex: number
    ): Promise<void> {
        const videoMode =
            state.settings.ccgConfig.channels[channelIndex].videoMode
        if (!videoMode) {
            return
        }
        const resX = videoMode.includes('720') ? 1280 : 1920
        const resY = videoMode.includes('720') ? 720 : 1080

        let scaleOutX = 1
        let scaleOutY = 1
        const outputSetting = this.reduxSettingsService.getOutputSettings(
            state.settings,
            channelIndex
        )
        if (outputSetting.shouldScale) {
            scaleOutX = outputSetting.scaleX / resX
            scaleOutY = outputSetting.scaleY / resY
        }

        await this.casparCgConnection.mixerFill(
            channelIndex + 1,
            layerIndex + 1,
            0,
            0,
            scaleOutX,
            scaleOutY,
            1
        )
    }
}
