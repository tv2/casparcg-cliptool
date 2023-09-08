import { ReduxSettingsService } from '../../shared/services/redux-settings-service'
import { state } from '../../shared/store'
import { Enum as CcgEnum } from 'casparcg-connection/dist/lib/ServerStateEnum'
import { CasparCG } from 'casparcg-connection'
import { logger } from '../utils/logger'
import { ErrorEvent } from '../../shared/models/error-models'
import { Simulate } from 'react-dom/test-utils'

/* Todo: Fix playing a file while connection to CasparCG isn't there waiting indefinitely, and then fires on reconnect.
         Should probably just time out after e.g 10 seconds.
*/
export class CasparCgPlayoutService {
    private readonly reduxSettingsService: ReduxSettingsService
    private readonly casparCgConnection: CasparCG
    private readonly socketServer: any

    public constructor(casparCgConnection: CasparCG, socketServer: any) {
        this.socketServer = socketServer
        this.reduxSettingsService = new ReduxSettingsService()
        this.casparCgConnection = casparCgConnection
    }

    public async playOrMixMedia(
        channelIndex: number,
        fileName: string
    ): Promise<void> {
        const mixState: boolean = this.reduxSettingsService.getOutputSettings(
            state.settings,
            channelIndex
        ).mixState
        const action = !mixState
            ? this.playMedia.bind(this)
            : this.mixMedia.bind(this)
        await action(channelIndex, 9, fileName).catch((reason) => {
            const message: string = `Failed to play file: ${fileName}`
            logger.data(error).error(message)
            this.notifyAboutError(message, reason as Error)
        })
    }

    private async playMedia(
        channelIndex: number,
        layerIndex: number,
        fileName: string
    ): Promise<void> {
        await this.scale(channelIndex, layerIndex)
        await this.executePlayMedia(channelIndex, layerIndex, fileName)
    }

    private async mixMedia(
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
        fileName: string
    ): Promise<void> {
        return this.executeLoadMedia(channelIndex, 9, fileName).catch(
            (reason) => {
                const message: string = `Failed to load file: ${fileName}`
                logger.data(error).error(message)
                this.notifyAboutError(message, reason as Error)
            }
        )
    }

    private notifyAboutError(message: string, error: Error): void {
        logger.data(error).error(message)
        const errorEvent: ErrorEvent = {
            message: message,
            errorMessage: error.message,
            shouldNotify: true,
        }
        this.socketServer.emit('error', errorEvent)
    }

    private async executeLoadMedia(
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
            throw new Error(
                `Expected a a value in fileName, but it was '${fileName}'`
            )
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
