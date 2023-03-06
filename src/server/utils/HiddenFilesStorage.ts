import { updateHiddenFiles } from '../../model/reducers/mediaActions'
import { HiddenFileInfo, IOutput } from '../../model/reducers/mediaReducer'
import { reduxState, reduxStore } from '../../model/reducers/store'
import * as IO from '../../model/SocketIoConstants'
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
            validateHiddenFilesContent(hiddenFilesFromFile)
        const hiddenFiles = !isInvalidHiddenFiles
            ? hiddenFilesFromFile
            : clearInvalidHiddenFiles(hiddenFilesFromFile)
        logger
            .data(hiddenFiles)
            .info(
                `File with Hidden files loaded${
                    isInvalidHiddenFiles
                        ? ' and cleaned. Saving the cleaned version'
                        : ''
                }:`
            )
        reduxStore.dispatch(updateHiddenFiles(hiddenFiles))
        socketServer.emit(IO.HIDDEN_FILES_UPDATE, hiddenFiles)
        if (isInvalidHiddenFiles) {
            saveHiddenFiles()
        }
    } catch (error) {
        logger.data(error).warn('Hidden files not found, or not yet stored.')
    }
}

export function saveHiddenFiles() {
    const hiddenFiles: Record<string, HiddenFileInfo> =
        reduxState.media[0].hiddenFiles
    const isInvalidHiddenFiles: boolean =
        validateHiddenFilesContent(hiddenFiles)
    const cleanHiddenFiles: Record<string, HiddenFileInfo> =
        !isInvalidHiddenFiles
            ? hiddenFiles
            : clearInvalidHiddenFiles(hiddenFiles)
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
                logger.data(error).error('Error writing file:')
            } else {
                logger.data(stringifiedHiddenFiles).trace('Hidden files saved')
            }
        }
    )
}

function validateHiddenFilesContent(
    hiddenFiles: Record<string, HiddenFileInfo>
): boolean {
    const outputs: IOutput[] = reduxState.media[0].output
    return outputs.some((output) => output.tallyFile in hiddenFiles)
}

function clearInvalidHiddenFiles(
    originalHiddenFiles: Record<string, HiddenFileInfo>
): Record<string, HiddenFileInfo> {
    const hiddenFiles: Record<string, HiddenFileInfo> = {
        ...originalHiddenFiles,
    }
    const outputs: IOutput[] = reduxState.media[0].output
    outputs.forEach((output) => {
        if (output.tallyFile in hiddenFiles) {
            delete hiddenFiles[output.tallyFile]
        }
    })
    return hiddenFiles
}
