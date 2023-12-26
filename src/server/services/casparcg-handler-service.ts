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
    CasparcgSettings,
    GenericSettings,
    OperationMode,
    OutputSettings,
} from '../../shared/models/settings-models'
import { ExpressService } from './express-service'
import {
    setGenerics,
    updateSettings,
} from '../../shared/actions/settings-action'
import { SettingsPersistenceService } from './settings-persistence-service'
import { defaultOutputSettingsState } from '../../shared/schemas/new-settings-schema'
import { UtilityService } from '../../shared/services/utility-service'
import { AmcpThumbnailsService } from './amcp-thumbnails-service'
import { AmcpMediaService } from './amcp-media-service'
import { CasparCgPlayoutService } from './casparcg-playout-service'
import { CasparCgInfoService, ChannelInfo } from './casparcg-info-service'

export class AmcpHandlerService {
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
        const casparCgSettings: CasparcgSettings =
            this.reduxSettingsService.getGenericSettings(
                state.settings
            ).ccgSettings
        return new CasparCG({
            host: casparCgSettings.ip,
            port: casparCgSettings.amcpPort,
            autoConnect: true,
            onConnected: this.onCasparCgConnect.bind(this),
            onDisconnected: this.onCasparCgDisconnected.bind(this),
        })
    }

    private async onCasparCgConnect(isConnected: boolean): Promise<void> {
        this.logConnectionStatus(isConnected)
        for (let i = 0; i < this.channelCount; i++) {
            if (!(await this.casparCgInfoService.isChannelBlank(i))) {
                continue
            }
            this.resendPlayOrLoadCommands(i)
            this.resendLoadOverlay(i)
        }
    }

    private logConnectionStatus(isConnected: boolean) {
        logger.info(`CasparCG connection state changed to: ${isConnected}`)
    }

    private onCasparCgDisconnected(isConnected: boolean): void {
        this.logConnectionStatus(isConnected)
    }

    private async resendLoadOverlay(index: number): Promise<void> {
        const outputSettings: OutputSettings =
            this.reduxSettingsService.getOutputSettings(state.settings, index)
        if (!outputSettings.webState || !outputSettings.webUrl) {
            return
        }
        this.casparCgPlayoutService
            .playOverlay(index, outputSettings.webUrl)
            .then(() =>
                logger.info(
                    `Resent load overlay command for channel ${
                        index + 1
                    }. Loaded '${outputSettings.webUrl}'`
                )
            )
    }

    private async resendPlayOrLoadCommands(index: number): Promise<void> {
        const outputSettings: OutputSettings =
            this.reduxSettingsService.getOutputSettings(state.settings, index)
        if (
            outputSettings.selectedFileName === '' &&
            outputSettings.cuedFileName === ''
        ) {
            return
        }
        if (outputSettings.selectedFileName !== '') {
            this.casparCgPlayoutService
                .playOrMixMedia(index, outputSettings.selectedFileName)
                .then(() =>
                    logger.info(
                        `Resent play command for channel ${
                            index + 1
                        }. Playing '${outputSettings.selectedFileName}'`
                    )
                )
        } else {
            this.casparCgPlayoutService
                .loadMedia(index, outputSettings.cuedFileName)
                .then(() =>
                    logger.info(
                        `Resent load command for channel ${
                            index + 1
                        }. Loaded '${outputSettings.cuedFileName}'`
                    )
                )
        }
    }

    public getCasparCgConnection(): CasparCG {
        return this.casparCgConnection
    }

    public async amcpHandler(retryAttempts: number = 0): Promise<void> {
        //Check CCG Version and initialise OSC server:
        logger.debug('Checking CasparCG connection')
        if (await this.checkConnection()) {
            await this.retrieveConfig()
            this.startFileChangesPollingInterval().then(() => {
                logger.info(
                    'Started continued polling for File and Thumbnail changes.'
                )
            })
        } else {
            retryAttempts++
            if (retryAttempts > 3) {
                const errorMessage: string =
                    'Failed to retrieve version from CasparCG - ' +
                    'Abandoning further attempts to retrieve version and startup.'
                logger.error(errorMessage)
                throw new Error(errorMessage)
            }
            logger.warn(
                `Failed to retrieve version from CasparCG - retrying ${retryAttempts}/3`
            )
            await this.delay(retryAttempts * 2000)
            await this.amcpHandler(retryAttempts)
        }
    }

    private delay(ms: number): Promise<unknown> {
        return new Promise((res) => setTimeout(res, ms))
    }

    private async checkConnection(): Promise<boolean> {
        try {
            const versionResponse = await this.casparCgConnection.version()
            const genericSettings: GenericSettings =
                this.reduxSettingsService.getGenericSettings(state.settings)
            const address: string = genericSettings.ccgSettings.ip
            const port: number = genericSettings.ccgSettings.amcpPort
            logger.info(`AMCP connection established to: ${address}:${port}`)
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
        await this.fillInDefaultOutputSettingsIfNeeded(config.channels.length)
        await this.settingsPersistenceService.resumeMigratingOldSettings()
        const genericSettings: GenericSettings = {
            ...this.reduxSettingsService.getGenericSettings(state.settings),
        }
        const allOutputSettings: OutputSettings[] = [
            ...genericSettings.outputSettings,
        ]
        const reinvigoratedChannels: OutputSettings[] = await Promise.all(
            config.channels.map(async ({}, index: number) => {
                const outputSettings: OutputSettings = {
                    ...allOutputSettings[index],
                }
                return await this.reinvigorateChannel(outputSettings, index)
            })
        )
        genericSettings.outputSettings =
            await this.synchronizeOutputSettingsWithPlayingChannels(
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

    private async synchronizeOutputSettingsWithPlayingChannels(
        outputSettings: OutputSettings[]
    ): Promise<OutputSettings[]> {
        return await Promise.all(
            outputSettings.map(
                async (outputSettings, index) =>
                    await this.synchronizeOutputSettingsWithPlayingChannel(
                        outputSettings,
                        index
                    )
            )
        )
    }

    private async synchronizeOutputSettingsWithPlayingChannel(
        outputSettings: OutputSettings,
        index: number
    ): Promise<OutputSettings> {
        const info: ChannelInfo = await this.casparCgInfoService.getChannelInfo(
            index
        )
        if (await this.casparCgInfoService.isChannelBlank(index)) {
            return outputSettings
        }
        if (!info.stage) {
            outputSettings.selectedFileName = ''
            outputSettings.cuedFileName = ''
            return outputSettings
        }
        const rawFilePath: string =
            info.stage.layer.layer_10.foreground.file.path
        const fileName: string = rawFilePath
            .substring(0, rawFilePath.lastIndexOf('.'))
            .toUpperCase()
        const isPaused: boolean = info.stage.layer.layer_10.foreground.paused
        if (
            fileName === outputSettings.selectedFileName ||
            fileName === outputSettings.cuedFileName
        ) {
            return outputSettings
        }
        logger.debug(
            `File playing or loaded on CasparCG channel ${index} is different than saved file. Updating saved value: ${fileName}`
        )
        if (!isPaused) {
            outputSettings.selectedFileName = fileName
        } else {
            outputSettings.cuedFileName = fileName
        }

        return outputSettings
    }

    private async fillInDefaultOutputSettingsIfNeeded(
        minimumOutputs: number
    ): Promise<void> {
        const genericSettings: GenericSettings = {
            ...this.reduxSettingsService.getGenericSettings(state.settings),
        }

        if (genericSettings.outputSettings.length >= minimumOutputs) {
            return
        }

        logger.debug(
            `Expanding amount of Output Settings in settings from ${genericSettings.outputSettings.length} to ${minimumOutputs}.`
        )
        genericSettings.outputSettings =
            this.utilityService.expandArrayWithDefaultsIfNeeded(
                [...genericSettings.outputSettings],
                defaultOutputSettingsState,
                minimumOutputs
            )
        reduxStore.dispatch(setGenerics(genericSettings))
        await this.settingsPersistenceService.save(genericSettings)
    }

    private async reinvigorateChannel(
        outputSettings: OutputSettings,
        index: number
    ): Promise<OutputSettings> {
        const cuedFileName = outputSettings.cuedFileName
        if (cuedFileName) {
            logger.info(`Re-loaded ${cuedFileName} on channel index ${index}.`)
            await this.casparCgPlayoutService.loadMedia(index, cuedFileName)
        }

        outputSettings.loopState = outputSettings.loopState ?? false
        outputSettings.manualStartState =
            outputSettings.manualStartState ?? false
        outputSettings.mixState = outputSettings.mixState ?? false
        outputSettings.webState = outputSettings.webState ?? false
        outputSettings.operationMode =
            outputSettings.operationMode ?? OperationMode.CONTROL

        return outputSettings
    }

    private startTimeEmitInterval(): void {
        //Update of timeleft is set to a default 40ms (same as 25FPS)
        const data: TimeSelectedFilePayload[] = []
        reduxStore.subscribe(() => {
            this.reduxMediaService
                .getOutputs(state.media)
                .forEach((output: Output, index: number) => {
                    const outputSettings =
                        this.reduxSettingsService.getOutputSettings(
                            state.settings,
                            index
                        )
                    data[index] = {
                        time: output.time,
                        selectedFileName: outputSettings.selectedFileName,
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
                .outputSettings
        ) {
            return
        }
        state.settings.ccgConfig.channels.forEach(async ({}, index) => {
            const outputSettings = this.reduxSettingsService.getOutputSettings(
                state.settings,
                index
            )
            if (outputSettings.webState) {
                await this.casparCgPlayoutService
                    .playOverlay(index, outputSettings.webUrl)
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
