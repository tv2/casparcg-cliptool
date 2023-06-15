import { updateHiddenFiles } from '../../shared/actions/media-actions'
import { HiddenFiles } from '../../shared/models/media-models'
import { state, reduxStore } from '../../shared/store'
import { socketServer } from '../handlers/express-handler'
import { logger } from '../utils/logger'
import { PersistenceService } from './persistence-service'
import { SettingsService } from '../../shared/services/settings-service'
import { OutputSettings } from '../../shared/models/settings-models'
import { ServerToClientCommand } from '../../shared/socket-io-constants'
import _ from 'lodash'

export class HiddenFilesPersistenceService {
    static readonly instance = new HiddenFilesPersistenceService()
    public load(): void {
        try {
            const hiddenFiles: HiddenFiles = JSON.parse(
                PersistenceService.instance.loadFile('hiddenFiles.json')
            )
            const isInvalidHiddenFiles: boolean =
                this.hasSelectedOrCuedHiddenFiles(hiddenFiles)

            if (isInvalidHiddenFiles) {
                this.cleanAndUpdateReduxState(hiddenFiles)
            } else {
                this.updateReduxState(hiddenFiles)
            }
        } catch (error) {
            logger
                .data(error)
                .warn(
                    'File containing hidden files not found, or not yet stored.'
                )
        }
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
        logger.data(hiddenFiles).info('File with Hidden files loaded.')
        reduxStore.dispatch(updateHiddenFiles(hiddenFiles))
        socketServer.emit(
            ServerToClientCommand.HIDDEN_FILES_UPDATE,
            hiddenFiles
        )
    }

    public save(hiddenFiles: HiddenFiles): void {
        const cleanHiddenFiles: HiddenFiles =
            this.getCleanHiddenFiles(hiddenFiles)
        const stringifiedHiddenFiles = JSON.stringify(cleanHiddenFiles)

        PersistenceService.instance.saveFile(
            'hiddenFiles.json',
            stringifiedHiddenFiles,
            (message: any) => {
                if (message) {
                    logger
                        .data(message)
                        .error('Error writing hiddenFiles file:')
                } else {
                    logger
                        .data(stringifiedHiddenFiles)
                        .trace('Hidden files saved')
                }
            }
        )
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
            SettingsService.instance.getGenericSettings(
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
            SettingsService.instance.getGenericSettings(
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
