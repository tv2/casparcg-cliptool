import { setGenerics } from '../../shared/actions/settings-action'
import {
    GenericSettings,
    OperationMode,
} from '../../shared/models/settings-models'
import { reduxStore, state } from '../../shared/store'
import { newGenericSettingsSchema } from '../../shared/schemas/new-settings-schema'
import { PreviousGenericSettings } from '../../shared/schemas/old-settings-schema'
import { ReduxSettingsService } from '../../shared/services/redux-settings-service'
import { logger } from '../utils/logger'
import { PersistenceService } from './persistence-service'
import { CasparCG } from 'casparcg-connection'

export class SettingsPersistenceService {
    private reduxSettingsService: ReduxSettingsService
    private persistenceService: PersistenceService

    constructor(reduxSettingsService?: ReduxSettingsService) {
        this.reduxSettingsService =
            reduxSettingsService ?? new ReduxSettingsService()
        this.persistenceService = new PersistenceService()
    }

    public load(): void {
        this.persistenceService
            .loadFile('settings.json')
            .then(async (loadedSettings) => {
                const rawSettings: unknown = JSON.parse(loadedSettings)
                const settings: GenericSettings = await this.parseSettings(
                    rawSettings
                )
                logger
                    .data(rawSettings)
                    .trace('Loaded following settings from file:')
                reduxStore.dispatch(setGenerics(settings))
            })
            .catch((error) => {
                logger
                    .data(error)
                    .warn(
                        'Settings not found, or not yet stored, dispatching defaults, and saving it.'
                    )
                reduxStore.dispatch(
                    setGenerics(
                        this.reduxSettingsService.getDefaultGenericSettings()
                    )
                )
                this.save()
            })
    }

    private async parseSettings(
        rawSettings: unknown
    ): Promise<GenericSettings> {
        const isNewStructure = this.isNewStructure(rawSettings)
        if (isNewStructure.success && isNewStructure.parsed) {
            return isNewStructure.parsed
        }
        logger.warn(
            'Failed to parse settings file to newest structure. ' +
                'Attempting to parse to old structure...'
        )

        const isOldStructure: {
            success: boolean
            parsed: PreviousGenericSettings | undefined
        } = this.isPreviousStructure(rawSettings)
        const parsedOld: GenericSettings | undefined =
            await this.parseOldSettings(isOldStructure)
        if (parsedOld) {
            return parsedOld
        }

        logger
            .data(rawSettings)
            .error('Failed to parse settings from file, using default!')
        return this.reduxSettingsService.getDefaultGenericSettings()
    }

    private async parseOldSettings(old: {
        success: boolean
        parsed: PreviousGenericSettings | undefined
    }): Promise<undefined | GenericSettings> {
        if (!old.success || !old.parsed) {
            return undefined
        }

        logger.warn(
            'Old settings structure detected ' +
                '- updating it to the new structure.'
        )
        const correctedSettings = await this.getCorrectedStructureFromOld(
            old.parsed
        )
        logger.info('New Settings structure generated, saving Settings...')
        this.save(correctedSettings)
        return correctedSettings
    }

    public save(genericSettings?: GenericSettings): void {
        const generics: GenericSettings = genericSettings
            ? genericSettings
            : this.reduxSettingsService.getGenericSettings(state.settings)
        const stringifiedSettings = JSON.stringify(generics)
        this.persistenceService
            .saveFile('settings.json', stringifiedSettings)
            .then(() => {
                logger.data(generics).debug('Settings saved')
            })
            .catch((error) => {
                logger.data(error).error('Error writing file:')
            })
    }

    // Checks if the loaded file has the structure of Cliptool version 2.14 and below.
    private isPreviousStructure(rawSettings: any): {
        success: boolean
        parsed: PreviousGenericSettings | undefined
    } {
        const parsed = PreviousGenericSettings.safeParse(rawSettings)
        if (parsed.success) {
            return { success: true, parsed: parsed.data }
        }
        logger
            .data(parsed)
            .trace('Failed to parse loaded settings to old structure')
        return { success: false, parsed: undefined }
    }

    // Checks if the loaded file has the structure of Cliptool version 2.15 and above.
    private isNewStructure(rawSettings: any): {
        success: boolean
        parsed: GenericSettings | undefined
    } {
        const parsed = newGenericSettingsSchema.safeParse(rawSettings)
        if (parsed.success) {
            logger.info('Loaded settings as new structure.')
            return { success: true, parsed: parsed.data as GenericSettings }
        }
        logger
            .data(parsed)
            .error('Failed to parse loaded settings to new structure')
        return { success: false, parsed: undefined }
    }

    private async getCorrectedStructureFromOld(
        old: PreviousGenericSettings
    ): Promise<GenericSettings> {
        const channelsCount: number = await this.retrieveChannelsCount(
            old.ccgIp,
            old.ccgAmcpPort
        )

        const newSettings: GenericSettings = {
            ...this.reduxSettingsService.getDefaultGenericSettings(
                channelsCount
            ),
        }
        newSettings.ccgSettings = {
            transitionTime: old.transitionTime ?? 16,
            ip: old.ccgIp ?? '0.0.0.0',
            amcpPort: old.ccgAmcpPort ?? 5250,
            defaultLayer: old.ccgDefaultLayer ?? 10,
            oscPort: old.ccgOscPort ?? 5253,
        }
        newSettings.outputSettings.forEach((output, index) => {
            output.label = old.outputLabels[index] ?? ''
            output.folder = old.outputFolders[index] ?? ''
            output.shouldScale = old.scale[index] ?? false
            output.scaleX = old.scaleX[index] ?? 1920
            output.scaleY = old.scaleY[index] ?? 1080
            output.webUrl = old.webURL[index] ?? ''
            output.loopState = old.startupLoopState[index] ?? false
            output.mixState = old.startupMixState[index] ?? false
            output.manualStartState =
                old.startupManualstartState[index] ?? false
            output.webState = old.startupWebState[index] ?? false
            output.operationMode =
                (old.startupOperationMode[index] as string as OperationMode) ??
                OperationMode.CONTROL
        })

        return newSettings
    }

    private async retrieveChannelsCount(
        ip: string,
        port: number
    ): Promise<number> {
        const tempCasparCgConnection = new CasparCG({
            host: ip,
            port: port,
            autoConnect: false,
        })

        const channelsCount = await tempCasparCgConnection
            .getCasparCGConfig()
            .then((config) => config.channels.length)
            .catch((error) => {
                logger
                    .data(error)
                    .warn(
                        'Failed to retrieve amount of channels from Temporary CasparCG connection. Using default of 1.'
                    )
                return 1
            })
        logger.debug(
            `Retrieved a count of ${channelsCount} channels from temporary CasparCG connection...`
        )
        return channelsCount
    }
}
