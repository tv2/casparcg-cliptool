import { updateHiddenFiles } from '../../shared/actions/media-actions'
import { HiddenFiles } from '../../shared/models/media-models'
import { state, reduxStore } from '../../shared/store'
import { logger } from '../utils/logger'
import { FileHandlingServices } from './filehandling-service'
import { ReduxSettingsService } from '../../shared/services/redux-settings-service'
import { OutputSettings } from '../../shared/models/settings-models'
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
} from '../../shared/socket-io-constants'
import _ from 'lodash'
import { Server as SocketServer } from 'socket.io'

export class HiddenFilesPersistenceService {
    private readonly reduxSettingsService: ReduxSettingsService
    private readonly fileHandlingServices: FileHandlingServices
    private readonly socketServer: SocketServer<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        any
    >

    constructor(
        socketServer: SocketServer<
            ClientToServerEvents,
            ServerToClientEvents,
            InterServerEvents,
            any
        >,
        reduxSettingsService?: ReduxSettingsService
    ) {
        this.socketServer = socketServer
        this.reduxSettingsService =
            reduxSettingsService ?? new ReduxSettingsService()
        this.fileHandlingServices = new FileHandlingServices()
    }

    public load(): void {
        this.fileHandlingServices
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
        this.socketServer.emit('hiddenFilesUpdate', hiddenFiles)
    }

    public save(hiddenFiles: HiddenFiles): void {
        const cleanHiddenFiles: HiddenFiles =
            this.getCleanHiddenFiles(hiddenFiles)
        const stringifiedHiddenFiles = JSON.stringify(cleanHiddenFiles)

        this.fileHandlingServices
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
