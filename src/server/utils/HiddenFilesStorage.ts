import { updateHiddenFiles } from '../../model/reducers/mediaActions'
import { IChangedInfo } from '../../model/reducers/mediaReducer'
import { reduxState, reduxStore } from '../../model/reducers/store'
import { logger } from './logger'

const fs = require('fs')
const path = require('path')

export function loadHiddenFiles() {
    try {
        const hiddenFilesFromFile: Record<string, IChangedInfo> = JSON.parse(
            fs.readFileSync(path.resolve('storage', 'hiddenFiles.json'))
        )
        logger.data(hiddenFilesFromFile).info('File loaded with Hidden files:')
        reduxStore.dispatch(updateHiddenFiles(hiddenFilesFromFile))
    } catch (error) {
        logger
            .data(error)
            .error('Hidden files not found, or not yet stored, using defaults')
    }
}

export function saveHiddenFiles() {
    const stringifiedHiddenFiles = JSON.stringify(
        reduxState.media[0].hiddenFiles
    )
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
                logger.data(stringifiedHiddenFiles).debug('Hidden files saved')
            }
        }
    )
}
