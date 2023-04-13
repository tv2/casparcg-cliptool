import { updateHiddenFiles } from '../../model/reducers/media-actions'
import { HiddenFileInfo } from '../../model/reducers/media-models'
import { state, reduxStore } from '../../model/reducers/store'
import { socketServer } from '../handlers/express-handler'
import { logger } from '../utils/logger'
import persistenceService from './persistence-service'
import settingsService from '../../model/services/settings-service'
import { OutputSettings } from '../../model/reducers/settings-models'
import { ServerToClient } from '../../model/socket-io-constants'

class HiddenFilesPersistenceService {
    public load(): void {
        try {
            const hiddenFilesFromFile: Record<string, HiddenFileInfo> =
                JSON.parse(persistenceService.loadFile('hiddenFiles.json'))
            const isInvalidHiddenFiles: boolean =
                this.validateHiddenFiles(hiddenFilesFromFile)
            const cleanHiddenFiles: Record<string, HiddenFileInfo> =
                this.getCleanHiddenFiles(hiddenFilesFromFile)
            logger
                .data(cleanHiddenFiles)
                .info(
                    `File with Hidden files loaded${
                        isInvalidHiddenFiles
                            ? ' and cleaned. Saving the cleaned version'
                            : ''
                    }:`
                )
            reduxStore.dispatch(updateHiddenFiles(cleanHiddenFiles))
            socketServer.emit(
                ServerToClient.HIDDEN_FILES_UPDATE,
                cleanHiddenFiles
            )
            if (isInvalidHiddenFiles) {
                this.save()
            }
        } catch (error) {
            logger
                .data(error)
                .warn(
                    'File containing hidden files not found, or not yet stored.'
                )
        }
    }

    public save(): void {
        const hiddenFiles: Record<string, HiddenFileInfo> =
            state.media.hiddenFiles
        const cleanHiddenFiles: Record<string, HiddenFileInfo> =
            this.getCleanHiddenFiles(hiddenFiles)
        const stringifiedHiddenFiles = JSON.stringify(cleanHiddenFiles)

        persistenceService.saveFile(
            'hiddenFiles.json',
            stringifiedHiddenFiles,
            (error: any) => {
                if (error) {
                    logger.data(error).error('Error writing hiddenFiles file:')
                } else {
                    logger
                        .data(stringifiedHiddenFiles)
                        .trace('Hidden files saved')
                }
            }
        )
    }

    private getCleanHiddenFiles(
        originalHiddenFiles: Record<string, HiddenFileInfo>
    ): Record<string, HiddenFileInfo> {
        const isInvalidHiddenFiles: boolean =
            this.validateHiddenFiles(originalHiddenFiles)
        const cleanHiddenFiles: Record<string, HiddenFileInfo> =
            isInvalidHiddenFiles
                ? this.clearInvalidHiddenFiles(originalHiddenFiles)
                : originalHiddenFiles
        return cleanHiddenFiles
    }

    private validateHiddenFiles(
        hiddenFiles: Record<string, HiddenFileInfo>
    ): boolean {
        const outputs: OutputSettings[] = settingsService.getGenericSettings(
            state.settings
        ).outputSettings
        return outputs.some((output) => output.selectedFileName in hiddenFiles)
    }

    private clearInvalidHiddenFiles(
        originalHiddenFiles: Record<string, HiddenFileInfo>
    ): Record<string, HiddenFileInfo> {
        const hiddenFiles: Record<string, HiddenFileInfo> = {
            ...originalHiddenFiles,
        }
        const outputs: OutputSettings[] = settingsService.getGenericSettings(
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

const hiddenFilesPersistenceService = new HiddenFilesPersistenceService()
export default hiddenFilesPersistenceService
