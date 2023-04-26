import { Media } from '../reducers/media-models'
import {
    GenericSettings,
    OutputSettings,
    Settings,
    TabInfo,
} from '../reducers/settings-models'
import {
    defaultCcgSettingsState,
    defaultOutputSettingsState,
    NewGenericSettings,
} from '../schemas/new-settings-schema'

class SettingsService {
    private fallBackDefaultSettings: GenericSettings

    constructor() {
        this.fallBackDefaultSettings = {
            ccgSettings: defaultCcgSettingsState,
            outputSettings: Array(8).fill(defaultOutputSettingsState),
        }
    }

    public getTabInfo(settingsState: Settings, mediaState: Media): TabInfo[] {
        return Array(mediaState.outputs.length)
            .fill({})
            .map(({}, index) => {
                const output = this.getOutputSettings(settingsState, index)
                return {
                    index,
                    title:
                        output && output.label
                            ? output.label
                            : `Output ${index + 1}`,
                }
            })
    }

    public getOutputSettings(
        settingsState: Settings,
        channelIndex: number
    ): OutputSettings {
        return settingsState.generics.outputSettings[channelIndex]
    }

    public getGenericSettings(settingsState: Settings): GenericSettings {
        return settingsState.generics
    }

    public getDefaultGenericSettings(): GenericSettings {
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
        const selectedFileName = this.getCleanSelectedFileName(
            this.getOutputSettings(settingsState, channelIndex),
            settingsState
        )
        return selectedFileName === thumbnailName
    }

    public isThumbnailCued(
        thumbnailName: string,
        settingsState: Settings,
        channelIndex: number
    ): boolean {
        const cuedFileName = this.getCleanCuedFileName(
            this.getOutputSettings(settingsState, channelIndex),
            settingsState
        )
        return cuedFileName === thumbnailName
    }

    public isThumbnailSelectedOnAnyOutput(
        thumbnailName: string,
        settingsState: Settings
    ): boolean {
        return this.getGenericSettings(settingsState).outputSettings.some(
            (output) =>
                this.getCleanSelectedFileName(output, settingsState) ===
                thumbnailName
        )
    }

    public getCleanSelectedFileName(
        output: OutputSettings,
        settingsState: Settings
    ): string {
        return this.getCleanString(output.selectedFileName, settingsState)
    }

    public getCleanCuedFileName(
        output: OutputSettings,
        settingsState: Settings
    ): string {
        return this.getCleanString(output.cuedFileName, settingsState)
    }

    private getCleanString(
        toBeCleaned: string,
        settingsState: Settings
    ): string {
        const fileName = toBeCleaned
            .toUpperCase()
            .replace(/\\/g, '/')
            .replace('//', '/')
            .split('.')
        // Remove system Path e.g.: D:\\media/:
        const cleanSelectedFileName = fileName[0].replace(
            settingsState.ccgConfig.path?.toUpperCase().replace(/\\/g, '/') +
                '/',
            ''
        )
        return cleanSelectedFileName
    }
}

const settingsService: SettingsService = new SettingsService()
export default settingsService
