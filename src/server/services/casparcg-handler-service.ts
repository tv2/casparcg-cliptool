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

export class CasparCgHandlerService {
    public static readonly instance = new CasparCgHandlerService()
    private reduxMediaService: ReduxMediaService
    private readonly reduxSettingsService: ReduxSettingsService
    private expressService: ExpressService
    private utilityService: UtilityService
    private settingsPersistenceService: SettingsPersistenceService
    private casparCgPlayoutService: CasparCgPlayoutService
    private readonly amcpThumbnailService: AmcpThumbnailsService
    private amcpMediaService: AmcpMediaService
    private readonly casparCgConnection: CasparCG
    private fileChangesInterval: NodeJS.Timeout | undefined
    private waitingForCasparCgResponse: boolean

    private constructor() {
        this.reduxMediaService = new ReduxMediaService()
        this.reduxSettingsService = new ReduxSettingsService()
        this.expressService = ExpressService.instance
        this.amcpThumbnailService = AmcpThumbnailsService.instance
        this.settingsPersistenceService = SettingsPersistenceService.instance

        this.utilityService = new UtilityService()
        this.waitingForCasparCgResponse = false

        //Setup AMCP Connection:
        this.casparCgConnection = this.createCasparCgConnection()

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
            this.casparCgConnection
        )
    }

    private createCasparCgConnection(): CasparCG {
        const casparCgSettings = this.reduxSettingsService.getGenericSettings(
            state.settings
        ).ccgSettings
        return new CasparCG({
            host: casparCgSettings.ip,
            port: casparCgSettings.amcpPort,
            autoConnect: true,
        })
    }

    public getCasparCgConnection(): CasparCG {
        return this.casparCgConnection
    }

    public async amcpHandler(retryAttempts: number = 0): Promise<void> {
        //Check CCG Version and initialise OSC server:
        logger.debug('Checking CasparCG connection')
        if (await this.checkVersion()) {
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
                `Failed to retrieve version from CasparCG CasparCG - retrying ${retryAttempts}/3`
            )
            await this.delay(retryAttempts * 2000)
            await this.amcpHandler(retryAttempts)
        }
    }

    private delay(ms: number): Promise<unknown> {
        return new Promise((res) => setTimeout(res, ms))
    }

    private async checkVersion(): Promise<boolean> {
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
        genericSettings.outputSettings = await Promise.all(
            config.channels.map(async ({}, index: number) => {
                const outputSettings: OutputSettings = {
                    ...allOutputSettings[index],
                }
                return await this.reinvigorateChannel(outputSettings, index)
            })
        )
        reduxStore.dispatch(setGenerics(genericSettings))
        logger.info(`Number of Channels: ${config.channels.length}`)
        this.expressService
            .getSocketServer()
            .emit(ServerToClientCommand.SETTINGS_UPDATE, state.settings)
        this.expressService.getSocketIoServerHandlerService().initializeClient()
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
            await this.casparCgPlayoutService.loadMedia(index, 9, cuedFileName)
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
                await this.casparCgPlayoutService.playOverlay(
                    index,
                    10,
                    outputSettings.webUrl
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
            async () => this.retrieveChangesIntervalAction(),
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
