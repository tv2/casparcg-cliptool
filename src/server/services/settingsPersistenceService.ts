import { setGenerics } from '../../model/reducers/settingsAction'
import {
    GenericSettings,
    OperationMode,
} from '../../model/reducers/settingsModels'
import { reduxState, reduxStore } from '../../model/reducers/store'
import { NewGenericSettings } from '../../model/schemas/new-settings-schema'
import { PreviousGenericSettings } from '../../model/schemas/old-settings-schema'
import settingsService from '../../model/services/settingsService'
import { logger } from '../utils/logger'
import persistenceService from './persistenceService'

class SettingsPersistenceService {
    load(): void {
        const defaultGenerics = settingsService.getDefaultGenericSettings()
        try {
            const settingsFromFile = JSON.parse(
                persistenceService.loadFile('settings.json')
            )
            let settings: GenericSettings | null = null
            let hasStructureBeenCorrected = false
            const isOld = this.isPreviousStructure(settingsFromFile)
            if (isOld.success && isOld.parsed) {
                logger.warn(
                    'Old settings structure detected - updating it to the new structure.'
                )
                settings = this.getCorrectedStructureFromOld(isOld.parsed)
                hasStructureBeenCorrected = true
            } else {
                const isNew = this.isNewStructure(settingsFromFile)
                if (isNew.success && isNew.parsed) {
                    settings = isNew.parsed
                } else {
                    logger
                        .data(settingsFromFile)
                        .error(
                            'Failed to parse settings from file, using default!'
                        )
                    settings = defaultGenerics
                }
            }

            logger.data(settingsFromFile).info('File loaded with settings:')
            reduxStore.dispatch(setGenerics(settings))
            if (hasStructureBeenCorrected) {
                logger.info(
                    'New Settings structure generated, saving Settings...'
                )
                this.save()
            }
        } catch (error) {
            logger.warn(
                'Settings not found, or not yet stored, dispatching defaults, and saving it.'
            )
            reduxStore.dispatch(setGenerics(defaultGenerics))
            this.save()
        }
    }

    public save(): void {
        const generics: GenericSettings = settingsService.getGenericSettings(
            reduxState.settings
        )
        const stringifiedSettings = JSON.stringify(generics)

        persistenceService.saveFile(
            'settings.json',
            stringifiedSettings,
            (error: any) => {
                if (error) {
                    logger.data(error).error('Error writing file:')
                } else {
                    logger.data(stringifiedSettings).info('Settings saved')
                }
            }
        )
    }

    private isPreviousStructure(loadedFile: any): {
        success: boolean
        parsed: PreviousGenericSettings | undefined
    } {
        const parsed = PreviousGenericSettings.safeParse(loadedFile)
        if (parsed.success) {
            return { success: true, parsed: parsed.data }
        }
        logger
            .data(parsed)
            .trace('Failed to parse loaded settings to old structure')
        return { success: false, parsed: undefined }
    }

    private isNewStructure(loadedFile: any): {
        success: boolean
        parsed: GenericSettings | undefined
    } {
        const parsed = NewGenericSettings.safeParse(loadedFile)
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
                old.startupManualStartState[index] ?? false
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
