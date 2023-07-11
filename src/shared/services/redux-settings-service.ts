import { Media, MediaFile } from '../models/media-models'
import {
    GenericSettings,
    OutputSettings,
    Settings,
    TabInfo,
} from '../models/settings-models'
import {
    defaultCcgSettingsState,
    defaultOutputSettingsState,
} from '../schemas/new-settings-schema'

export class ReduxSettingsService {
    private defaultGenericSettings: GenericSettings

    constructor() {
        this.defaultGenericSettings = {
            ccgSettings: defaultCcgSettingsState,
            outputSettings: Array(1).fill({ ...defaultOutputSettingsState }),
        }
    }

    public getTabInfo(settingsState: Settings, mediaState: Media): TabInfo[] {
        return Array(mediaState.outputs.length)
            .fill({})
            .map(({}, index) => this.buildTabInfoForIndex(settingsState, index))
    }

    private buildTabInfoForIndex(
        settingsState: Settings,
        index: number
    ): TabInfo {
        const output = this.getOutputSettings(settingsState, index)
        return {
            index,
            title:
                output && output.label ? output.label : `Output ${index + 1}`,
        }
    }

    public getOutputSettings(
        settingsState: Settings,
        channelIndex: number
    ): OutputSettings {
        return settingsState.generics.outputSettings[channelIndex]
    }

    public clearInvalidTargetedPaths(
        allFiles: MediaFile[],
        originalOutputSettings: OutputSettings,
        mediaState: Media
    ): OutputSettings {
        const outputSettings = { ...originalOutputSettings }
        if (this.isPathsEmpty(outputSettings)) {
            return outputSettings
        }
        this.clearClickedFileFromSettings(allFiles, outputSettings)
        this.clearSelectedFolderFromSettings(mediaState, outputSettings)
        return outputSettings
    }

    private clearSelectedFolderFromSettings(
        mediaState: Media,
        outputSettings: OutputSettings
    ) {
        if (!mediaState.folders.includes(outputSettings.folder)) {
            outputSettings.folder = ''
        }
    }

    private clearClickedFileFromSettings(
        allFiles: MediaFile[],
        outputSettings: OutputSettings
    ) {
        const mediaFile = allFiles.find((file) => {
            file.name === outputSettings.cuedFileName ||
                file.name === outputSettings.selectedFileName
        })
        if (!mediaFile) {
            outputSettings.cuedFileName = ''
            outputSettings.selectedFileName = ''
        }
    }

    private isPathsEmpty(outputSettings: OutputSettings): boolean {
        return (
            outputSettings.selectedFileName === '' &&
            outputSettings.cuedFileName === '' &&
            outputSettings.folder === ''
        )
    }

    public getAllOutputSettings(settingsState: Settings): OutputSettings[] {
        return settingsState.generics.outputSettings
    }

    public getGenericSettings(settingsState: Settings): GenericSettings {
        return settingsState.generics
    }

    public getDefaultGenericSettings(): GenericSettings {
        return this.defaultGenericSettings
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

    public isMediaCued(
        fileName: string,
        settingsState: Settings,
        channelIndex: number
    ): boolean {
        const cuedFileName = this.getCleanCuedFileName(
            this.getOutputSettings(settingsState, channelIndex),
            settingsState
        )
        return cuedFileName === fileName
    }

    public isCardSelectedOnAnyOutput(
        fileName: string,
        settingsState: Settings
    ): boolean {
        return this.getGenericSettings(settingsState).outputSettings.some(
            (output) =>
                this.getCleanSelectedFileName(output, settingsState) ===
                fileName
        )
    }

    public isCardCuedOnAnyOutput(
        fileName: string,
        settingsState: Settings
    ): boolean {
        return this.getGenericSettings(settingsState).outputSettings.some(
            (output) =>
                this.getCleanCuedFileName(output, settingsState) === fileName
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
        return fileName[0].replace(
            settingsState.ccgConfig.path?.toUpperCase().replace(/\\/g, '/') +
                '/',
            ''
        )
    }
}
