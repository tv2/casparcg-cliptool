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
import { loadMedia, playOverlay } from '../utils/ccg-load-play'
import { UtilityService } from '../../shared/services/utility-service'
import { AmcpThumbnailsService } from './amcp-thumbnails-service'
import { AmcpMediaService } from './amcp-media-service'

export class CasparCgHandlerService {
    public static readonly instance = new CasparCgHandlerService()
    private reduxMediaService: ReduxMediaService
    private readonly reduxSettingsService: ReduxSettingsService
    private expressService: ExpressService
    private utilityService: UtilityService
    private settingsPersistenceService: SettingsPersistenceService
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

        this.utilityService = new UtilityService()
        this.settingsPersistenceService = new SettingsPersistenceService(
            this.reduxSettingsService
        )
        this.waitingForCasparCgResponse = false

        //Setup AMCP Connection:
        this.casparCgConnection = new CasparCG({
            host: this.reduxSettingsService.getGenericSettings(state.settings)
                .ccgSettings.ip,
            port: this.reduxSettingsService.getGenericSettings(state.settings)
                .ccgSettings.amcpPort,
            autoConnect: true,
        })

        this.amcpThumbnailService.setupAmcpThumbnailService(
            this.casparCgConnection,
            this.expressService.getSocketServer()
        )
        this.amcpMediaService = new AmcpMediaService(
            this.casparCgConnection,
            this.expressService.getSocketServer(),
            this.amcpThumbnailService
        )
    }
    public getCasparCgConnection(): CasparCG {
        return this.casparCgConnection
    }

    public async amcpHandler(): Promise<void> {
        //Check CCG Version and initialise OSC server:
        logger.debug('Checking CasparCG connection')
        if (await this.checkVersion()) {
            await this.getConfig()
        }
        this.startFileChangesPollingInterval().then(() => {
            logger.info(
                'Started continued polling for File and Thumbnail changes.'
            )
        })
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

    private async getConfig(): Promise<void> {
        try {
            const config = await this.casparCgConnection.getCasparCGConfig()
            this.dispatchConfig(config)
            this.waitingForCasparCgResponse = false
            this.startTimeEmitInterval()
            this.loadInitialOverlay()
        } catch (error) {
            logger.data(error).error('Error receiving CasparCG Config:')
        }
    }

    private dispatchConfig(config: any): void {
        logger.data(config.channels).info('CasparCG Config : ')
        reduxStore.dispatch(setNumberOfOutputs(config.channels.length))
        reduxStore.dispatch(
            updateSettings(config.channels, config.paths.mediaPath)
        )
        this.fillInDefaultOutputSettingsIfNeeded(config.channels.length)
        const genericSettings = {
            ...this.reduxSettingsService.getGenericSettings(state.settings),
        }
        const allOutputSettings = [...genericSettings.outputSettings]

        config.channels.forEach(({}, index: number) => {
            const outputSettings = { ...allOutputSettings[index] }
            allOutputSettings[index] = this.reinvigorateChannel(
                outputSettings,
                index
            )
        })
        genericSettings.outputSettings = allOutputSettings
        reduxStore.dispatch(setGenerics(genericSettings))
        logger.info(`Number of Channels: ${config.channels.length}`)
        this.expressService
            .getSocketServer()
            .emit(ServerToClientCommand.SETTINGS_UPDATE, state.settings)
        this.expressService.getSocketIoServerHandlerService().initializeClient()
    }

    private fillInDefaultOutputSettingsIfNeeded(minimumOutputs: number) {
        const genericSettings = {
            ...this.reduxSettingsService.getGenericSettings(state.settings),
        }

        if (genericSettings.outputSettings.length < minimumOutputs) {
            const expandedOutputSettings =
                this.utilityService.expandArrayWithDefaultsIfNeeded(
                    [...genericSettings.outputSettings],
                    defaultOutputSettingsState,
                    minimumOutputs
                )
            genericSettings.outputSettings = expandedOutputSettings
            reduxStore.dispatch(setGenerics(genericSettings))
            this.settingsPersistenceService.save(genericSettings)
        }
    }

    private reinvigorateChannel(
        outputSettings: OutputSettings,
        index: number
    ): OutputSettings {
        const cuedFileName = outputSettings.cuedFileName
        if (cuedFileName) {
            logger.info(`Re-loaded ${cuedFileName} on channel index ${index}.`)
            loadMedia(index, 9, cuedFileName)
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

    private startTimeEmitInterval() {
        //Update of timeleft is set to a default 40ms (same as 25FPS)
        let data: TimeSelectedFilePayload[] = []
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
        state.settings.ccgConfig.channels.forEach(({}, index) => {
            const outputSettings = this.reduxSettingsService.getOutputSettings(
                state.settings,
                index
            )
            if (outputSettings.webState) {
                playOverlay(index, 10, outputSettings.webUrl)
            }
        })
    }

    private async startFileChangesPollingInterval(): Promise<void> {
        if (this.fileChangesInterval) {
            clearInterval(this.fileChangesInterval)
            this.fileChangesInterval = undefined
        }
        logger.info('Retrieving initial Files and Thumbnails.')
        await this.amcpMediaService.getFileChanges()
        await this.amcpThumbnailService.getThumbnailChanges()
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
            await this.amcpMediaService.getFileChanges()
            await this.amcpThumbnailService.getThumbnailChanges()
        } finally {
            this.waitingForCasparCgResponse = false
        }
    }
}
