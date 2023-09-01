import { ReduxSettingsService } from '../../shared/services/redux-settings-service'
import { CasparCgHandlerService } from './casparcg-handler-service'
import { state } from '../../shared/store'
import { Enum as CcgEnum } from 'casparcg-connection/dist/lib/ServerStateEnum'

export class CasparCgPlayoutService {
    private readonly reduxSettingsService: ReduxSettingsService
    private readonly casparCgHandlerService: CasparCgHandlerService

    public constructor() {
        this.reduxSettingsService = new ReduxSettingsService()
        this.casparCgHandlerService = CasparCgHandlerService.instance
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
    ) {
        try {
            const loopState = this.getLoopState(channelIndex)
            await this.casparCgHandlerService
                .getCasparCgConnection()
                .play(
                    channelIndex + 1,
                    layerIndex + 1,
                    fileName,
                    loopState,
                    transitionType,
                    transitionTime
                )
            return Promise.resolve()
        } catch (error) {
            return Promise.reject(error)
        }
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
        try {
            const loopState = this.getLoopState(channelIndex)
            await this.casparCgHandlerService
                .getCasparCgConnection()
                .load(channelIndex + 1, layerIndex + 1, fileName, loopState)
            return Promise.resolve()
        } catch (error) {
            return Promise.reject(error)
        }
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

        await this.casparCgHandlerService
            .getCasparCgConnection()
            .loadHtmlPage(channelIndex + 1, layerIndex + 1, fileName)

        await this.casparCgHandlerService
            .getCasparCgConnection()
            .playHtmlPage(channelIndex + 1, layerIndex + 1)
    }

    public async stopOverlay(
        channelIndex: number,
        layerIndex: number
    ): Promise<void> {
        await this.casparCgHandlerService
            .getCasparCgConnection()
            .stop(channelIndex + 1, layerIndex + 1)
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

        await this.casparCgHandlerService
            .getCasparCgConnection()
            .mixerFill(
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
