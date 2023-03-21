import { setGenerics } from '../../model/reducers/settingsAction'
import {
    GenericSettings,
    OperationMode,
} from '../../model/reducers/settingsModels'
import { reduxStore } from '../../model/reducers/store'
import {
    NewGenericSettings,
    PreviousGenericSettings,
} from '../../model/schemas/settingsSchema'
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
            if (isOld.success) {
                logger.warn(
                    'Old settings structure detected - updating it to the new structure.'
                )
                settings = this.getCorrectedStructureFromOld(isOld.parsed)
                hasStructureBeenCorrected = true
            } else {
                const isNew = this.isNewStructure(settingsFromFile)
                if (isNew.success) {
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
        const generics: GenericSettings = settingsService.getGenericSettings()
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
        return { success: false, parsed: undefined }
    }

    private isNewStructure(loadedFile: any): {
        success: boolean
        parsed: GenericSettings | undefined
    } {
        const parsed = NewGenericSettings.safeParse(loadedFile)
        if (parsed.success) {
            return { success: true, parsed: parsed.data as GenericSettings }
        } else {
            // Would very much like to log this with the logger, but 'logger' is server only, and 'getDefaultGenericSettings()' is used in models
            console.log('Parsed Error', (parsed as any).error)
        }
        return { success: false, parsed: undefined }
    }

    private getCorrectedStructureFromOld(
        old: PreviousGenericSettings
    ): GenericSettings {
        const newSettings: GenericSettings = {
            ...settingsService.getDefaultGenericSettings(),
        }
        newSettings.transitionTime = old.transitionTime ?? 16
        newSettings.ccgIp = old.ccgIp ?? '0.0.0.0'
        newSettings.ccgAmcpPort = old.ccgAmcpPort ?? 5250
        newSettings.ccgDefaultLayer = old.ccgDefaultLayer ?? 5253
        newSettings.ccgOscPort = old.ccgOscPort ?? 10
        newSettings.outputs.forEach((output, index) => {
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
