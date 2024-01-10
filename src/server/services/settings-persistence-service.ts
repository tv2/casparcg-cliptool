import { setGenerics } from '../../shared/actions/settings-action'
import { GenericSettings } from '../../shared/models/settings-models'
import { reduxStore, state } from '../../shared/store'
import { newGenericSettingsSchema } from '../../shared/schemas/new-settings-schema'
import { ReduxSettingsService } from '../../shared/services/redux-settings-service'
import { logger } from '../utils/logger'
import { FileHandlingService } from './filehandling-service'

export class SettingsPersistenceService {
    public static readonly instance = new SettingsPersistenceService()
    private readonly reduxSettingsService: ReduxSettingsService
    private readonly fileHandlingService: FileHandlingService

    private constructor() {
        this.reduxSettingsService = new ReduxSettingsService()
        this.fileHandlingService = new FileHandlingService()
    }

    public async load(): Promise<void> {
        const loadedSettings = await this.fileHandlingService.loadFile(
            'settings.json'
        )
        const rawSettings: unknown = JSON.parse(loadedSettings)
        const validation = await this.validateSettingsFile(rawSettings)
        if (validation.success && validation.parsed) {
            logger
                .data(rawSettings)
                .trace('Loaded following settings from file:')
            reduxStore.dispatch(setGenerics(validation.parsed))
        } else {
            reduxStore.dispatch(
                setGenerics(
                    this.reduxSettingsService.getDefaultGenericSettings()
                )
            )
        }
        this.save()
    }

    // Checks if the loaded file has the correct structure for Cliptool
    private validateSettingsFile(rawSettings: unknown): {
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

    public async save(genericSettings?: GenericSettings): Promise<void> {
        const generics: GenericSettings = genericSettings
            ? genericSettings
            : this.reduxSettingsService.getGenericSettings(state.settings)
        const stringifiedSettings = JSON.stringify(generics)
        try {
            await this.fileHandlingService.saveFile(
                'settings.json',
                stringifiedSettings
            )
            logger.data(generics).debug('Settings saved')
        } catch (error) {
            logger.data(error).error('Error writing file:')
        }
    }
}
