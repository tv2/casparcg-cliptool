import { MediaFile, MediaState } from '../models/media-models'
import {
    GenericSettings,
    OutputSettings,
    SettingsState,
    TabInfo,
} from '../models/settings-models'
import {
    defaultCcgSettingsState,
    defaultOutputSettingsState,
} from '../schemas/new-settings-schema'

export class ReduxSettingsService {
    constructor() {}

    public getTabInfo(
        settingsState: SettingsState,
        mediaState: MediaState
    ): TabInfo[] {
        return Array(mediaState.outputs.length)
            .fill({})
            .map(({}, index) => this.buildTabInfoForIndex(settingsState, index))
    }

    private buildTabInfoForIndex(
        settingsState: SettingsState,
        index: number
    ): TabInfo {
        const output: OutputSettings = this.getOutputSettings(
            settingsState,
            index
        )
        return {
            index,
            title:
                output && output.label ? output.label : `Output ${index + 1}`,
        }
    }

    public getOutputSettings(
        settingsState: SettingsState,
        channelIndex: number
    ): OutputSettings {
        return settingsState.generics.outputSettings[channelIndex]
    }

    public getOutputSettingsFolder(
        settingsState: SettingsState,
        index: number
    ): string {
        return this.getOutputSettings(settingsState, index).folder
    }

    public clearInvalidTargetedPaths(
        allFiles: MediaFile[],
        originalOutputSettings: OutputSettings,
        mediaState: MediaState
    ): OutputSettings {
        const outputSettings: OutputSettings = { ...originalOutputSettings }
        if (this.isPathsEmpty(outputSettings)) {
            return outputSettings
        }
        this.clearClickedFileFromSettings(allFiles, outputSettings)
        this.clearSelectedFolderFromSettings(mediaState, outputSettings)
        return outputSettings
    }

    private clearSelectedFolderFromSettings(
        mediaState: MediaState,
        outputSettings: OutputSettings
    ): void {
        if (
            !(outputSettings.folder === '') &&
            !mediaState.folders.includes(outputSettings.folder)
        ) {
            outputSettings.folder = ''
        }
    }

    private clearClickedFileFromSettings(
        allFiles: MediaFile[],
        outputSettings: OutputSettings
    ): void {
        if (
            outputSettings.selectedFileName === '' &&
            outputSettings.cuedFileName === ''
        ) {
            return
        }
        const mediaFile: MediaFile | undefined = allFiles.find(
            (file) =>
                file.name === outputSettings.cuedFileName ||
                file.name === outputSettings.selectedFileName
        )
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

    public getAllOutputSettings(
        settingsState: SettingsState
    ): OutputSettings[] {
        return settingsState.generics.outputSettings
    }

    public getGenericSettings(settingsState: SettingsState): GenericSettings {
        return settingsState.generics
    }

    public getDefaultGenericSettings(): GenericSettings {
        return {
            ccgSettings: defaultCcgSettingsState,
            outputSettings: Array(1).fill({
                ...defaultOutputSettingsState,
            }),
        }
    }

    public isThumbnailSelected(
        thumbnailName: string,
        settingsState: SettingsState,
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
        settingsState: SettingsState,
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
        settingsState: SettingsState
    ): boolean {
        return this.getGenericSettings(settingsState).outputSettings.some(
            (output) =>
                this.getCleanSelectedFileName(output, settingsState) ===
                fileName
        )
    }

    public isCardCuedOnAnyOutput(
        fileName: string,
        settingsState: SettingsState
    ): boolean {
        return this.getGenericSettings(settingsState).outputSettings.some(
            (output) =>
                this.getCleanCuedFileName(output, settingsState) === fileName
        )
    }

    public getCleanSelectedFileName(
        output: OutputSettings,
        settingsState: SettingsState
    ): string {
        return this.getCleanString(output.selectedFileName, settingsState)
    }

    public getCleanCuedFileName(
        output: OutputSettings,
        settingsState: SettingsState
    ): string {
        return this.getCleanString(output.cuedFileName, settingsState)
    }

    private getCleanString(
        toBeCleaned: string,
        settingsState: SettingsState
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
