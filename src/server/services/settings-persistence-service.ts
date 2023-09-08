import { setGenerics } from '../../shared/actions/settings-action'
import {
    CasparcgSettings,
    GenericSettings,
    OperationMode,
    OutputSettings,
} from '../../shared/models/settings-models'
import { reduxStore, state } from '../../shared/store'
import { newGenericSettingsSchema } from '../../shared/schemas/new-settings-schema'
import { PreviousGenericSettings } from '../../shared/schemas/old-settings-schema'
import { ReduxSettingsService } from '../../shared/services/redux-settings-service'
import { logger } from '../utils/logger'
import { PersistenceService } from './persistence-service'

export class SettingsPersistenceService {
    public static readonly instance = new SettingsPersistenceService()
    private readonly reduxSettingsService: ReduxSettingsService
    private readonly persistenceService: PersistenceService
    private savedOldSettings: PreviousGenericSettings | undefined

    private constructor() {
        this.reduxSettingsService = new ReduxSettingsService()
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
            await this.partiallyParseOldSettings(isOldStructure)
        if (parsedOld) {
            return parsedOld
        }

        logger
            .data(rawSettings)
            .error('Failed to parse settings from file, using default!')
        return this.reduxSettingsService.getDefaultGenericSettings()
    }

    // Checks if the loaded file has the structure of Cliptool version 2.14 and below.
    private isPreviousStructure(rawSettings: unknown): {
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
    private isNewStructure(rawSettings: unknown): {
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

    private async partiallyParseOldSettings(parsedPreviousGenericSettings: {
        success: boolean
        parsed: PreviousGenericSettings | undefined
    }): Promise<undefined | GenericSettings> {
        if (
            !parsedPreviousGenericSettings.success ||
            !parsedPreviousGenericSettings.parsed
        ) {
            return undefined
        }
        logger.warn(
            'Old settings structure detected. ' +
                'Migrating CasparCG related settings, then saving the old settings to resume ones CasparCG connection has been established.'
        )
        const partiallyMigratedSettings: GenericSettings = {
            ...this.reduxSettingsService.getDefaultGenericSettings(),
        }
        partiallyMigratedSettings.ccgSettings = this.getCasparCgSettingsFromOld(
            parsedPreviousGenericSettings.parsed
        )
        logger.debug('Saving partially migrated settings...')
        this.savedOldSettings = parsedPreviousGenericSettings.parsed
        await this.save(partiallyMigratedSettings)
        return partiallyMigratedSettings
    }

    public async save(genericSettings?: GenericSettings): Promise<void> {
        const generics: GenericSettings = genericSettings
            ? genericSettings
            : this.reduxSettingsService.getGenericSettings(state.settings)
        const stringifiedSettings = JSON.stringify(generics)
        try {
            await this.persistenceService.saveFile(
                'settings.json',
                stringifiedSettings
            )
            logger.data(generics).debug('Settings saved')
        } catch (error) {
            logger.data(error).error('Error writing file:')
        }
    }

    public async resumeMigratingOldSettings(): Promise<void> {
        if (!this.savedOldSettings) {
            return
        }
        logger.debug('Resuming migration of old settings to new structure.')
        const migratedSettings: GenericSettings =
            this.getFullCorrectedStructureFromStoredOldIfPresent(
                this.savedOldSettings
            )
        await this.save(migratedSettings)
        reduxStore.dispatch(setGenerics(migratedSettings))
        this.savedOldSettings = undefined
    }

    private getFullCorrectedStructureFromStoredOldIfPresent(
        previousGenericSettings: PreviousGenericSettings
    ): GenericSettings {
        const newSettings: GenericSettings = {
            ...this.reduxSettingsService.getDefaultGenericSettings(),
        }
        newSettings.ccgSettings = this.getCasparCgSettingsFromOld(
            previousGenericSettings
        )
        newSettings.outputSettings = this.getOutputSettingsFromOld(
            previousGenericSettings
        )

        return newSettings
    }

    private getCasparCgSettingsFromOld(
        previousGenericSettings: PreviousGenericSettings
    ): CasparcgSettings {
        return {
            transitionTime: previousGenericSettings.transitionTime ?? 16,
            ip: previousGenericSettings.ccgIp ?? '0.0.0.0',
            amcpPort: previousGenericSettings.ccgAmcpPort ?? 5250,
            defaultLayer: previousGenericSettings.ccgDefaultLayer ?? 10,
            oscPort: previousGenericSettings.ccgOscPort ?? 5253,
        }
    }

    private getOutputSettingsFromOld(
        previousGenericSettings: PreviousGenericSettings
    ): OutputSettings[] {
        const outputSettings: OutputSettings[] = [
            ...state.settings.generics.outputSettings,
        ]
        return outputSettings.map((outputSetting, index) => {
            const copiedOutputSettings: OutputSettings = { ...outputSetting }
            copiedOutputSettings.label =
                previousGenericSettings.outputLabels[index] ?? ''
            copiedOutputSettings.folder =
                previousGenericSettings.outputFolders[index] ?? ''
            copiedOutputSettings.shouldScale =
                previousGenericSettings.scale[index] ?? false
            copiedOutputSettings.scaleX =
                previousGenericSettings.scaleX[index] ?? 1920
            copiedOutputSettings.scaleY =
                previousGenericSettings.scaleY[index] ?? 1080
            copiedOutputSettings.webUrl =
                previousGenericSettings.webURL[index] ?? ''
            copiedOutputSettings.loopState =
                previousGenericSettings.startupLoopState[index] ?? false
            copiedOutputSettings.mixState =
                previousGenericSettings.startupMixState[index] ?? false
            copiedOutputSettings.manualStartState =
                previousGenericSettings.startupManualstartState[index] ?? false
            copiedOutputSettings.webState =
                previousGenericSettings.startupWebState[index] ?? false
            copiedOutputSettings.operationMode =
                (previousGenericSettings.startupOperationMode[
                    index
                ] as string as OperationMode) ?? OperationMode.CONTROL
            return copiedOutputSettings
        })
    }
}
