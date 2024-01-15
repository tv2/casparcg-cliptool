import { MediaFile, MediaState } from '../models/media-models'
import {
    GenericSettings,
    OutputState,
    SettingsState,
    TabInfo,
} from '../models/settings-models'
import {
    defaultCcgSettingsState,
    defaultOutputState,
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
        const output: OutputState = this.getOutputState(settingsState, index)
        return {
            index,
            title:
                output && output.label ? output.label : `Output ${index + 1}`,
        }
    }

    public getOutputState(
        settingsState: SettingsState,
        channelIndex: number
    ): OutputState {
        return settingsState.generics.outputsState[channelIndex]
    }

    public getOutputStateFolder(
        settingsState: SettingsState,
        index: number
    ): string {
        return this.getOutputState(settingsState, index).folder
    }

    public clearInvalidTargetedPaths(
        allFiles: MediaFile[],
        originalOutputState: OutputState,
        mediaState: MediaState
    ): OutputState {
        let outputState: OutputState = { ...originalOutputState }
        if (this.isPathsEmpty(outputState)) {
            return outputState
        }
        outputState = this.clearClickedFileFromSettings(allFiles, outputState)
        outputState = this.clearSelectedFolderFromSettings(
            mediaState,
            outputState
        )
        return outputState
    }

    private clearSelectedFolderFromSettings(
        mediaState: MediaState,
        outputState: OutputState
    ): OutputState {
        if (
            !(outputState.folder === '') &&
            !mediaState.folders.includes(outputState.folder)
        ) {
            outputState.folder = ''
        }
        return outputState
    }

    private clearClickedFileFromSettings(
        allFiles: MediaFile[],
        outputState: OutputState
    ): OutputState {
        if (
            outputState.selectedFileName === '' &&
            outputState.cuedFileName === ''
        ) {
            return outputState
        }
        const mediaFile: MediaFile | undefined = allFiles.find(
            (file) =>
                file.name === outputState.cuedFileName ||
                file.name === outputState.selectedFileName
        )

        if (!mediaFile) {
            outputState.cuedFileName = ''
            outputState.selectedFileName = ''
        }
        return outputState
    }

    private isPathsEmpty(outputState: OutputState): boolean {
        return (
            outputState.selectedFileName === '' &&
            outputState.cuedFileName === '' &&
            outputState.folder === ''
        )
    }

    public getAllOutputsState(settingsState: SettingsState): OutputState[] {
        return settingsState.generics.outputsState
    }

    public getGenericSettings(settingsState: SettingsState): GenericSettings {
        return settingsState.generics
    }

    public getDefaultGenericSettings(arrayLength: number = 1): GenericSettings {
        return {
            ccgSettings: defaultCcgSettingsState,
            outputsState: Array(arrayLength).fill({
                ...defaultOutputState,
            }),
        }
    }

    public isThumbnailSelected(
        thumbnailName: string,
        settingsState: SettingsState,
        channelIndex: number
    ): boolean {
        const selectedFileName = this.getCleanSelectedFileName(
            this.getOutputState(settingsState, channelIndex),
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
            this.getOutputState(settingsState, channelIndex),
            settingsState
        )
        return cuedFileName === fileName
    }

    public isCardSelectedOnAnyOutput(
        fileName: string,
        settingsState: SettingsState
    ): boolean {
        return this.getGenericSettings(settingsState).outputsState.some(
            (output) =>
                this.getCleanSelectedFileName(output, settingsState) ===
                fileName
        )
    }

    public isCardCuedOnAnyOutput(
        fileName: string,
        settingsState: SettingsState
    ): boolean {
        return this.getGenericSettings(settingsState).outputsState.some(
            (output) =>
                this.getCleanCuedFileName(output, settingsState) === fileName
        )
    }

    public getCleanSelectedFileName(
        output: OutputState,
        settingsState: SettingsState
    ): string {
        return this.getCleanString(output.selectedFileName, settingsState)
    }

    public getCleanCuedFileName(
        output: OutputState,
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
