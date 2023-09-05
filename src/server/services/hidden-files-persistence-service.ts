import { updateHiddenFiles } from '../../shared/actions/media-actions'
import { HiddenFiles } from '../../shared/models/media-models'
import { state, reduxStore } from '../../shared/store'
import { logger } from '../utils/logger'
import { PersistenceService } from './persistence-service'
import { ReduxSettingsService } from '../../shared/services/redux-settings-service'
import { OutputSettings } from '../../shared/models/settings-models'
import { ServerToClientCommand } from '../../shared/socket-io-constants'
import _ from 'lodash'

export class HiddenFilesPersistenceService {
    private reduxSettingsService: ReduxSettingsService
    private persistenceService: PersistenceService
    private socketServer: any

    constructor(
        socketServer: any,
        reduxSettingsService?: ReduxSettingsService
    ) {
        this.socketServer = socketServer
        this.reduxSettingsService =
            reduxSettingsService ?? new ReduxSettingsService()
        this.persistenceService = new PersistenceService()
    }

    public load(): void {
        this.persistenceService
            .loadFile('hiddenFiles.json')
            .then((rawHiddenFiles) => {
                const hiddenFiles: HiddenFiles = JSON.parse(rawHiddenFiles)
                const isInvalidHiddenFiles: boolean =
                    this.hasSelectedOrCuedHiddenFiles(hiddenFiles)

                if (isInvalidHiddenFiles) {
                    this.cleanAndUpdateReduxState(hiddenFiles)
                } else {
                    this.updateReduxState(hiddenFiles)
                }
            })
            .catch((error) => {
                logger
                    .data(error)
                    .warn(
                        'File containing hidden files not found, or not yet stored.'
                    )
            })
    }

    private cleanAndUpdateReduxState(hiddenFiles: HiddenFiles) {
        const cleanedHiddenFiles = this.getValidHiddenFiles(hiddenFiles)
        logger
            .data(_.omit(hiddenFiles, _.keys(cleanedHiddenFiles)))
            .warn('Removed Invalid entries found in Hidden Files:')
        this.updateReduxState(cleanedHiddenFiles)
        this.save(cleanedHiddenFiles)
    }

    private updateReduxState(hiddenFiles: HiddenFiles) {
        logger.data(hiddenFiles).trace('Hidden files File loaded with:')
        reduxStore.dispatch(updateHiddenFiles(hiddenFiles))
        this.socketServer.emit(
            ServerToClientCommand.HIDDEN_FILES_UPDATE,
            hiddenFiles
        )
    }

    public save(hiddenFiles: HiddenFiles): void {
        const cleanHiddenFiles: HiddenFiles =
            this.getCleanHiddenFiles(hiddenFiles)
        const stringifiedHiddenFiles = JSON.stringify(cleanHiddenFiles)

        this.persistenceService
            .saveFile('hiddenFiles.json', stringifiedHiddenFiles)
            .then(() => {
                logger.data(stringifiedHiddenFiles).trace('Hidden files saved')
            })
            .catch((error) => {
                logger.data(error).error('Error writing hiddenFiles file:')
            })
    }

    private getCleanHiddenFiles(originalHiddenFiles: HiddenFiles): HiddenFiles {
        const isInvalidHiddenFiles: boolean =
            this.hasSelectedOrCuedHiddenFiles(originalHiddenFiles)
        const cleanHiddenFiles: HiddenFiles = isInvalidHiddenFiles
            ? this.getValidHiddenFiles(originalHiddenFiles)
            : originalHiddenFiles
        return cleanHiddenFiles
    }

    private hasSelectedOrCuedHiddenFiles(hiddenFiles: HiddenFiles): boolean {
        const outputs: OutputSettings[] =
            this.reduxSettingsService.getGenericSettings(
                state.settings
            ).outputSettings
        return outputs.some(
            (output) =>
                output.selectedFileName in hiddenFiles ||
                output.cuedFileName in hiddenFiles
        )
    }

    private getValidHiddenFiles(originalHiddenFiles: HiddenFiles): HiddenFiles {
        const hiddenFiles: HiddenFiles = {
            ...originalHiddenFiles,
        }
        const outputs: OutputSettings[] =
            this.reduxSettingsService.getGenericSettings(
                state.settings
            ).outputSettings
        outputs.forEach((output) => {
            if (output.selectedFileName in hiddenFiles) {
                delete hiddenFiles[output.selectedFileName]
            }
        })
        return hiddenFiles
    }
}
