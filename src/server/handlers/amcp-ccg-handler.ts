import { CasparCG } from 'casparcg-connection'
import { setNumberOfOutputs } from '../../shared/actions/media-actions'
import { Output } from '../../shared/models/media-models'
import { ReduxMediaService } from '../../shared/services/redux-media-service'
import { ReduxSettingsService } from '../../shared/services/redux-settings-service'
import {
    ServerToClientCommand,
    TimeSelectedFilePayload,
} from '../../shared/socket-io-constants'
import { reduxStore, state } from '../../shared/store'
import { logger } from '../utils/logger'
import {
    GenericSettings,
    OperationMode,
    OutputState,
} from '../../shared/models/settings-models'
import { ExpressService } from '../services/express-service'
import {
    setGenerics,
    updateSettings,
} from '../../shared/actions/settings-action'
import { SettingsPersistenceService } from '../services/settings-persistence-service'
import { defaultOutputState } from '../../shared/schemas/new-settings-schema'
import { UtilityService } from '../../shared/services/utility-service'
import { AmcpThumbnailsService } from '../services/amcp-thumbnails-service'
import { AmcpMediaService } from '../services/amcp-media-service'
import { CasparCgPlayoutService } from '../services/casparcg-playout-service'
import {
    CasparCgInfoService,
    ChannelInfo,
} from '../services/casparcg-info-service'

export class AmcpHandler {
    private readonly reduxMediaService: ReduxMediaService
    private readonly reduxSettingsService: ReduxSettingsService
    private readonly expressService: ExpressService
    private readonly utilityService: UtilityService
    private readonly settingsPersistenceService: SettingsPersistenceService
    private readonly casparCgPlayoutService: CasparCgPlayoutService
    private readonly amcpThumbnailService: AmcpThumbnailsService
    private readonly amcpMediaService: AmcpMediaService
    private readonly casparCgConnection: CasparCG
    private readonly casparCgInfoService: CasparCgInfoService
    private fileChangesInterval: NodeJS.Timeout | undefined
    private waitingForCasparCgResponse: boolean
    private channelCount: number

    constructor() {
        this.reduxMediaService = new ReduxMediaService()
        this.reduxSettingsService = new ReduxSettingsService()
        this.expressService = ExpressService.instance
        this.amcpThumbnailService = AmcpThumbnailsService.instance
        this.settingsPersistenceService = SettingsPersistenceService.instance

        this.utilityService = new UtilityService()
        this.waitingForCasparCgResponse = false
        this.channelCount = 0

        //Setup AMCP Connection:
        this.casparCgConnection = this.createAmcpConnection()
        this.amcpThumbnailService.setupAmcpThumbnailService(
            this.casparCgConnection,
            this.expressService.getSocketServer()
        )
        this.expressService.setupExpressService(this.casparCgConnection)
        this.amcpMediaService = new AmcpMediaService(
            this.casparCgConnection,
            this.expressService.getSocketServer(),
            this.amcpThumbnailService
        )
        this.casparCgPlayoutService = new CasparCgPlayoutService(
            this.casparCgConnection,
            this.expressService.getSocketServer()
        )
        this.casparCgInfoService = new CasparCgInfoService(
            this.casparCgConnection
        )
    }

    private createAmcpConnection(): CasparCG {
        const ccgSettings = state.settings.generics.ccgSettings
        return new CasparCG({
            host: ccgSettings.ip,
            port: ccgSettings.amcpPort,
            autoConnect: true,
            onConnected: this.onCasparCgConnect,
            onDisconnected: this.onCasparCgDisconnected,
        })
    }

    private async onCasparCgConnect(): Promise<void> {
        const ccgSettings = state.settings.generics.ccgSettings
        const address: string = ccgSettings.ip
        const port: number = ccgSettings.amcpPort
        logger.info(`AMCP connection established to: ${address}:${port}`)

        for (let i = 0; i < this.channelCount; i++) {
            if (!(await this.casparCgInfoService.isChannelBlank(i))) {
                continue
            }
            this.resendPlayOrLoadCommands(i)
            this.resendLoadOverlay(i)
        }
    }

    private onCasparCgDisconnected(): void {
        logger.info(`CasparCG AMCP connection is disconnected`)
    }

    private async resendLoadOverlay(index: number): Promise<void> {
        const outputState: OutputState =
            this.reduxSettingsService.getOutputState(state.settings, index)
        if (!outputState.webState || !outputState.webUrl) {
            return
        }
        this.casparCgPlayoutService
            .playOverlay(index, outputState.webUrl)
            .then(() =>
                logger.info(
                    `Resent load overlay command for channel ${
                        index + 1
                    }. Loaded '${outputState.webUrl}'`
                )
            )
    }

    private async resendPlayOrLoadCommands(index: number): Promise<void> {
        const outputState: OutputState =
            this.reduxSettingsService.getOutputState(state.settings, index)
        if (
            outputState.selectedFileName === '' &&
            outputState.cuedFileName === ''
        ) {
            return
        }
        if (outputState.selectedFileName !== '') {
            this.casparCgPlayoutService
                .playOrMixMedia(index, outputState.selectedFileName)
                .then(() =>
                    logger.info(
                        `Resent play command for channel ${
                            index + 1
                        }. Playing '${outputState.selectedFileName}'`
                    )
                )
        } else {
            this.casparCgPlayoutService
                .loadMedia(index, outputState.cuedFileName)
                .then(() =>
                    logger.info(
                        `Resent load command for channel ${
                            index + 1
                        }. Loaded '${outputState.cuedFileName}'`
                    )
                )
        }
    }

    public async amcpHandler(): Promise<void> {
        //Check CCG Version and initialise OSC server:
        logger.debug('Checking CasparCG connection')
        await this.checkCcgVersion()
        await this.retrieveConfig()
        this.startFileChangesPollingInterval().then(() => {
            logger.info(
                'Started continued polling for File and Thumbnail changes.'
            )
        })
    }

    private async checkCcgVersion(): Promise<boolean> {
        try {
            const versionResponse = await this.casparCgConnection.version()
            logger.info(
                `CasparCG Server Version: ${versionResponse.response.data}`
            )
            return true
        } catch (error) {
            logger.data(error).error('No connection to CasparCG ')
        }
        return false
    }

    private async retrieveConfig(): Promise<void> {
        try {
            const config = await this.casparCgConnection.getCasparCGConfig()
            await this.dispatchConfig(config)
            this.waitingForCasparCgResponse = false
            this.startTimeEmitInterval()
            this.loadInitialOverlay()
        } catch (error) {
            logger.data(error).error('Error receiving CasparCG Config:')
        }
    }

    private async dispatchConfig(config: any): Promise<void> {
        logger.data(config.channels).info('CasparCG Config : ')
        reduxStore.dispatch(setNumberOfOutputs(config.channels.length))
        reduxStore.dispatch(
            updateSettings(config.channels, config.paths.mediaPath)
        )
        await this.fillInDefaultOutputsStateIfNeeded(config.channels.length)
        const genericSettings: GenericSettings = {
            ...this.reduxSettingsService.getGenericSettings(state.settings),
        }
        const allOutputsState: OutputState[] = [...genericSettings.outputsState]
        const reinvigoratedChannels: OutputState[] = await Promise.all(
            config.channels.map(async ({}, index: number) => {
                const outputState: OutputState = {
                    ...allOutputsState[index],
                }
                return await this.reinvigorateChannel(outputState, index)
            })
        )
        genericSettings.outputsState =
            await this.synchronizeOutputsStateWithCcgActiveState(
                reinvigoratedChannels
            )
        reduxStore.dispatch(setGenerics(genericSettings))
        await this.settingsPersistenceService.save(genericSettings)
        logger.info(`Number of Channels: ${config.channels.length}`)
        this.channelCount = config.channels.length
        this.expressService
            .getSocketServer()
            .emit(ServerToClientCommand.SETTINGS_UPDATE, state.settings)
        this.expressService.getSocketIoServerHandlerService().initializeClient()
    }

    private async synchronizeOutputsStateWithCcgActiveState(
        outputsState: OutputState[]
    ): Promise<OutputState[]> {
        return await Promise.all(
            outputsState.map(
                async (outputState, index) =>
                    await this.synchronizeOutputStateWithCcgPlayingState(
                        outputState,
                        index
                    )
            )
        )
    }

    private async synchronizeOutputStateWithCcgPlayingState(
        outputState: OutputState,
        index: number
    ): Promise<OutputState> {
        const info: ChannelInfo = await this.casparCgInfoService.getChannelInfo(
            index
        )
        if (!info.stage) {
            return outputState
        }
        const rawFilePath: string =
            info.stage.layer.layer_10.foreground.file.path
        const fileName: string = rawFilePath
            .substring(0, rawFilePath.lastIndexOf('.'))
            .toUpperCase()
        const isPaused: boolean = info.stage.layer.layer_10.foreground.paused
        if (
            fileName === outputState.selectedFileName ||
            fileName === outputState.cuedFileName
        ) {
            return outputState
        }
        logger.debug(
            `File playing or loaded on CasparCG channel ${index} is different than saved file. Updating saved value: ${fileName}`
        )
        if (!isPaused) {
            outputState.selectedFileName = fileName
        } else {
            outputState.cuedFileName = fileName
        }

        return outputState
    }

    private async fillInDefaultOutputsStateIfNeeded(
        minimumOutputs: number
    ): Promise<void> {
        const genericSettings: GenericSettings = {
            ...this.reduxSettingsService.getGenericSettings(state.settings),
        }

        if (genericSettings.outputsState.length >= minimumOutputs) {
            return
        }

        logger.debug(
            `Expanding amount of Output Settings in settings from ${genericSettings.outputsState.length} to ${minimumOutputs}.`
        )
        genericSettings.outputsState =
            this.utilityService.expandArrayWithDefaultsIfNeeded(
                [...genericSettings.outputsState],
                defaultOutputState,
                minimumOutputs
            )
        reduxStore.dispatch(setGenerics(genericSettings))
        await this.settingsPersistenceService.save(genericSettings)
    }

    private async reinvigorateChannel(
        outputState: OutputState,
        index: number
    ): Promise<OutputState> {
        const cuedFileName = outputState.cuedFileName
        if (cuedFileName) {
            logger.info(`Re-loaded ${cuedFileName} on channel index ${index}.`)
            await this.casparCgPlayoutService.loadMedia(index, cuedFileName)
        }

        outputState.loopState = outputState.loopState ?? false
        outputState.manualStartState = outputState.manualStartState ?? false
        outputState.mixState = outputState.mixState ?? false
        outputState.webState = outputState.webState ?? false
        outputState.operationMode =
            outputState.operationMode ?? OperationMode.CONTROL

        return outputState
    }

    private startTimeEmitInterval(): void {
        //Update of timeleft is set to a default 40ms (same as 25FPS)
        const data: TimeSelectedFilePayload[] = []
        reduxStore.subscribe(() => {
            this.reduxMediaService
                .getOutputs(state.media)
                .forEach((output: Output, index: number) => {
                    const outputState =
                        this.reduxSettingsService.getOutputState(
                            state.settings,
                            index
                        )
                    data[index] = {
                        time: output.time,
                        selectedFileName: outputState.selectedFileName,
                    }
                })
        })
        setInterval(() => {
            this.expressService
                .getSocketServer()
                .emit(ServerToClientCommand.TIME_TALLY_UPDATE, data)
        }, 40)
    }

    private loadInitialOverlay(): void {
        if (
            !this.reduxSettingsService.getGenericSettings(state.settings)
                .outputsState
        ) {
            return
        }
        state.settings.ccgConfig.channels.forEach(async ({}, index) => {
            const outputState = this.reduxSettingsService.getOutputState(
                state.settings,
                index
            )
            if (outputState.webState) {
                await this.casparCgPlayoutService
                    .playOverlay(index, outputState.webUrl)
                    .catch((error) =>
                        logger
                            .data(error)
                            .warn('Failed to play overlay with error:')
                    )
            }
        })
    }

    private async startFileChangesPollingInterval(): Promise<void> {
        if (this.fileChangesInterval) {
            clearInterval(this.fileChangesInterval)
            this.fileChangesInterval = undefined
        }
        logger.info('Retrieving initial Thumbnails and Files.')
        await this.amcpThumbnailService.getThumbnailChanges()
        await this.amcpMediaService.getFileChanges()
        this.fileChangesInterval = setInterval(
            this.retrieveChangesIntervalAction.bind(this),
            3000
        )
    }

    private async retrieveChangesIntervalAction(): Promise<void> {
        if (this.waitingForCasparCgResponse) {
            return
        }
        this.waitingForCasparCgResponse = true
        try {
            await this.amcpThumbnailService.getThumbnailChanges()
            await this.amcpMediaService.getFileChanges()
        } finally {
            this.waitingForCasparCgResponse = false
        }
    }
}
