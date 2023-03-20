import { updateHiddenFiles } from '../../model/reducers/mediaActions'
import { HiddenFileInfo, Output } from '../../model/reducers/mediaModels'
import { OutputSettings } from '../../model/reducers/settingsModels'
import { reduxState, reduxStore } from '../../model/reducers/store'
import settingsService from '../../model/services/settingsService'
import * as IO from '../../model/socketIoConstants'
import { socketServer } from '../handlers/expressHandler'
import { logger } from './logger'

const fs = require('fs')
const path = require('path')

export function loadHiddenFiles() {
    try {
        const hiddenFilesFromFile: Record<string, HiddenFileInfo> = JSON.parse(
            fs.readFileSync(path.resolve('storage', 'hiddenFiles.json'))
        )
        const isInvalidHiddenFiles: boolean =
            validateHiddenFiles(hiddenFilesFromFile)
        const cleanHiddenFiles: Record<string, HiddenFileInfo> =
            getCleanHiddenFiles(hiddenFilesFromFile)
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
        socketServer.emit(IO.HIDDEN_FILES_UPDATE, cleanHiddenFiles)
        if (isInvalidHiddenFiles) {
            saveHiddenFiles()
        }
    } catch (error) {
        logger
            .data(error)
            .warn('File containing hidden files not found, or not yet stored.')
    }
}

export function saveHiddenFiles() {
    const hiddenFiles: Record<string, HiddenFileInfo> =
        reduxState.media.hiddenFiles
    const cleanHiddenFiles: Record<string, HiddenFileInfo> =
        getCleanHiddenFiles(hiddenFiles)
    const stringifiedHiddenFiles = JSON.stringify(cleanHiddenFiles)
    if (!fs.existsSync('storage')) {
        fs.mkdirSync('storage')
    }
    fs.writeFile(
        path.resolve('storage', 'hiddenFiles.json'),
        stringifiedHiddenFiles,
        'utf8',
        (error) => {
            if (error) {
                logger.data(error).error('Error writing hiddenFiles file:')
            } else {
                logger.data(stringifiedHiddenFiles).trace('Hidden files saved')
            }
        }
    )
}

function getCleanHiddenFiles(
    originalHiddenFiles: Record<string, HiddenFileInfo>
): Record<string, HiddenFileInfo> {
    const isInvalidHiddenFiles: boolean =
        validateHiddenFiles(originalHiddenFiles)
    const cleanHiddenFiles: Record<string, HiddenFileInfo> =
        isInvalidHiddenFiles
            ? clearInvalidHiddenFiles(originalHiddenFiles)
            : originalHiddenFiles
    return cleanHiddenFiles
}

function validateHiddenFiles(
    hiddenFiles: Record<string, HiddenFileInfo>
): boolean {
    const outputs: OutputSettings[] =
        settingsService.getGenericSettings().outputs
    return outputs.some((output) => output.selectedFile in hiddenFiles)
}

function clearInvalidHiddenFiles(
    originalHiddenFiles: Record<string, HiddenFileInfo>
): Record<string, HiddenFileInfo> {
    const hiddenFiles: Record<string, HiddenFileInfo> = {
        ...originalHiddenFiles,
    }
    const outputs: OutputSettings[] =
        settingsService.getGenericSettings().outputs
    outputs.forEach((output) => {
        if (output.selectedFile in hiddenFiles) {
            delete hiddenFiles[output.selectedFile]
        }
    })
    return hiddenFiles
}
