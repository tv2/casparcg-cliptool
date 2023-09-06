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
    private reduxSettingsService: ReduxSettingsService
    private persistenceService: PersistenceService
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

    private async partiallyParseOldSettings(old: {
        success: boolean
        parsed: PreviousGenericSettings | undefined
    }): Promise<undefined | GenericSettings> {
        if (!old.success || !old.parsed) {
            return undefined
        }
        logger.warn(
            'Old settings structure detected. ' +
                'Migrates CasparCG related settings, then saving the old settings to resume ones CasparCG Connection has been established.'
        )
        const partiallyMigratedSettings: GenericSettings = {
            ...this.reduxSettingsService.getDefaultGenericSettings(),
        }
        partiallyMigratedSettings.ccgSettings = this.getCasparCgSettingsFromOld(
            old.parsed
        )
        logger.debug('Saving partially migrated settings...')
        this.savedOldSettings = old.parsed
        this.save(partiallyMigratedSettings)
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
        const migratedSettings =
            await this.getFullCorrectedStructureFromStoredOldIfPresent(
                this.savedOldSettings
            )
        this.save(migratedSettings)
        reduxStore.dispatch(setGenerics(migratedSettings))
        this.savedOldSettings = undefined
    }

    private async getFullCorrectedStructureFromStoredOldIfPresent(
        old: PreviousGenericSettings
    ): Promise<GenericSettings> {
        const newSettings: GenericSettings = {
            ...this.reduxSettingsService.getDefaultGenericSettings(),
        }
        newSettings.ccgSettings = this.getCasparCgSettingsFromOld(old)
        newSettings.outputSettings = this.getOutputSettingsFromOld(old)

        return newSettings
    }

    private getCasparCgSettingsFromOld(
        old: PreviousGenericSettings
    ): CasparcgSettings {
        return {
            transitionTime: old.transitionTime ?? 16,
            ip: old.ccgIp ?? '0.0.0.0',
            amcpPort: old.ccgAmcpPort ?? 5250,
            defaultLayer: old.ccgDefaultLayer ?? 10,
            oscPort: old.ccgOscPort ?? 5253,
        }
    }

    private getOutputSettingsFromOld(
        old: PreviousGenericSettings
    ): OutputSettings[] {
        const outputSettings: OutputSettings[] = [
            ...state.settings.generics.outputSettings,
        ]
        return outputSettings.map((outputSetting, index) => {
            const copiedOutputSettings: OutputSettings = { ...outputSetting }
            copiedOutputSettings.label = old.outputLabels[index] ?? ''
            copiedOutputSettings.folder = old.outputFolders[index] ?? ''
            copiedOutputSettings.shouldScale = old.scale[index] ?? false
            copiedOutputSettings.scaleX = old.scaleX[index] ?? 1920
            copiedOutputSettings.scaleY = old.scaleY[index] ?? 1080
            copiedOutputSettings.webUrl = old.webURL[index] ?? ''
            copiedOutputSettings.loopState =
                old.startupLoopState[index] ?? false
            copiedOutputSettings.mixState = old.startupMixState[index] ?? false
            copiedOutputSettings.manualStartState =
                old.startupManualstartState[index] ?? false
            copiedOutputSettings.webState = old.startupWebState[index] ?? false
            copiedOutputSettings.operationMode =
                (old.startupOperationMode[index] as string as OperationMode) ??
                OperationMode.CONTROL
            return copiedOutputSettings
        })
    }
}
