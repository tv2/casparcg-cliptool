import { setGenerics } from '../../shared/actions/settings-action'
import {
    GenericSettings,
    OperationMode,
} from '../../shared/models/settings-models'
import { state, reduxStore } from '../../shared/store'
import { newGenericSettingsSchema } from '../../shared/schemas/new-settings-schema'
import { PreviousGenericSettings } from '../../shared/schemas/old-settings-schema'
import settingsService from '../../shared/services/settings-service'
import { logger } from '../utils/logger'
import persistenceService from './persistence-service'

class SettingsPersistenceService {
    load(): void {
        try {
            const rawSettings: unknown = JSON.parse(
                persistenceService.loadFile('settings.json')
            )
            let settings: GenericSettings = this.parseSettings(rawSettings)
            logger.data(rawSettings).info('File loaded with settings:')
            reduxStore.dispatch(setGenerics(settings))
        } catch (error) {
            logger.warn(
                'Settings not found, or not yet stored, dispatching defaults, and saving it.'
            )
            reduxStore.dispatch(
                setGenerics(settingsService.getDefaultGenericSettings())
            )
            this.save()
        }
    }

    private parseSettings(rawSettings: unknown): GenericSettings {
        const isOldStructure = this.isPreviousStructure(rawSettings)
        if (isOldStructure.success && isOldStructure.parsed) {
            logger.warn(
                'Old settings structure detected ' +
                    '- updating it to the new structure.'
            )
            const correctedSettings = this.getCorrectedStructureFromOld(
                isOldStructure.parsed
            )
            logger.info('New Settings structure generated, saving Settings...')
            this.save(correctedSettings)
            return correctedSettings
        }

        const isNewStructure = this.isNewStructure(rawSettings)
        if (isNewStructure.success && isNewStructure.parsed) {
            return isNewStructure.parsed
        }

        logger
            .data(rawSettings)
            .error('Failed to parse settings from file, using default!')
        return settingsService.getDefaultGenericSettings()
    }

    public save(genericSettings?: GenericSettings): void {
        const generics: GenericSettings = genericSettings
            ? genericSettings
            : settingsService.getGenericSettings(state.settings)
        const stringifiedSettings = JSON.stringify(generics)
        persistenceService.saveFile(
            'settings.json',
            stringifiedSettings,
            (message: any) => {
                if (message) {
                    logger.data(message).error('Error writing file:')
                } else {
                    logger.data(generics).debug('Settings saved')
                }
            }
        )
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

    private getCorrectedStructureFromOld(
        old: PreviousGenericSettings
    ): GenericSettings {
        const newSettings: GenericSettings = {
            ...settingsService.getDefaultGenericSettings(),
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
}

const settingsPersistenceService = new SettingsPersistenceService()
export default settingsPersistenceService
