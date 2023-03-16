import { GenericSettings, OperationMode } from '../reducers/settingsModels'
import {
    defaultOutputSettingsState,
    NewGenericSettings,
    PreviousGenericSettings,
} from '../schemas/settingsSchema'

class SettingsFileService {
    fallBackDefaultSettings: GenericSettings

    constructor() {
        this.fallBackDefaultSettings = {
            transitionTime: 16,
            ccgIp: '0.0.0.0',
            ccgAmcpPort: 5250,
            ccgDefaultLayer: 5253,
            ccgOscPort: 10,
            outputs: Array(8).fill(defaultOutputSettingsState),
        }
    }

    isPreviousStructure(loadedFile: any): {
        success: boolean
        parsed: PreviousGenericSettings | undefined
    } {
        const parsed = PreviousGenericSettings.safeParse(loadedFile)
        if (parsed.success) {
            return { success: true, parsed: parsed.data }
        }
        return { success: false, parsed: undefined }
    }

    isNewStructure(loadedFile: any): {
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

    getCorrectedStructureFromOld(
        old: PreviousGenericSettings
    ): GenericSettings {
        const newSettings: GenericSettings = {
            ...this.getDefaultGenericSettings(),
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

    getDefaultGenericSettings(): GenericSettings {
        const parsed = NewGenericSettings.safeParse({})
        if (parsed.success) {
            return parsed.data as GenericSettings
        }
        return this.fallBackDefaultSettings
    }
}

const settingsFileService = new SettingsFileService()
export default settingsFileService
