import {
    GenericSettings,
    OutputSettings,
    Settings,
} from '../reducers/settings-models'
import {
    defaultOutputSettingsState,
    NewGenericSettings,
} from '../schemas/new-settings-schema'

class SettingsService {
    private fallBackDefaultSettings: GenericSettings

    constructor() {
        this.fallBackDefaultSettings = {
            ccgSettings: {
                transitionTime: 16,
                ip: '0.0.0.0',
                amcpPort: 5250,
                defaultLayer: 5253,
                oscPort: 10,
            },
            outputSettings: Array(8).fill(defaultOutputSettingsState),
        }
    }
    getOutputSettings(
        settingsState: Settings,
        channelIndex: number
    ): OutputSettings {
        return settingsState.generics.outputSettings[channelIndex]
    }

    getGenericSettings(settingsState: Settings): GenericSettings {
        return settingsState.generics
    }

    getDefaultGenericSettings(): GenericSettings {
        const parsed = NewGenericSettings.safeParse({})
        return parsed.success
            ? (parsed.data as GenericSettings)
            : this.fallBackDefaultSettings
    }

    public isThumbnailSelected(
        thumbnailName: string,
        settingsState: Settings,
        channelIndex: number
    ): boolean {
        const selectedFileName = this.getCleanSelectedFile(
            this.getOutputSettings(settingsState, channelIndex),
            settingsState
        )
        return selectedFileName === thumbnailName
    }

    public isThumbnailSelectedOnAnyOutput(
        thumbnailName: string,
        settingsState: Settings
    ): boolean {
        return this.getGenericSettings(settingsState).outputSettings.some(
            (output) =>
                this.getCleanSelectedFile(output, settingsState) ===
                thumbnailName
        )
    }

    public getCleanSelectedFile(
        output: OutputSettings,
        settingsState: Settings
    ): string {
        const selectedFileName = output.selectedFile
            .toUpperCase()
            .replace(/\\/g, '/')
            .replace('//', '/')
            .split('.')
        // Remove system Path e.g.: D:\\media/:
        const cleanSelectedFileName = selectedFileName[0].replace(
            settingsState.ccgConfig.path?.toUpperCase().replace(/\\/g, '/') +
                '/',
            ''
        )
        return cleanSelectedFileName
    }
}

const settingsService: SettingsService = new SettingsService()
export default settingsService
