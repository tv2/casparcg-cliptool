import { updateHiddenFiles } from '../../model/reducers/mediaActions'
import { IHiddenFileInfo } from '../../model/reducers/mediaReducer'
import { reduxState, reduxStore } from '../../model/reducers/store'
import * as IO from '../../model/SocketIoConstants'
import { socketServer } from '../handlers/expressHandler'
import { logger } from './logger'

const fs = require('fs')
const path = require('path')

export function loadHiddenFiles() {
    try {
        const hiddenFilesFromFile: Record<string, IHiddenFileInfo>[] =
            JSON.parse(
                fs.readFileSync(path.resolve('storage', 'hiddenFiles.json'))
            )
        let channelIndex = 0
        hiddenFilesFromFile.forEach((record) => {
            reduxStore.dispatch(updateHiddenFiles(channelIndex, record))
            socketServer.emit(IO.HIDDEN_FILES_UPDATE, channelIndex, record)
            channelIndex++
        })
        logger.data(hiddenFilesFromFile).info('File loaded with Hidden files:')
    } catch (error) {
        logger
            .data(error)
            .error('Hidden files not found, or not yet stored, using defaults')
    }
}

export function saveHiddenFiles() {
    const stringifiedHiddenFiles = JSON.stringify(
        reduxState.media[0].output.map((channel) => channel.hiddenFiles)
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
                logger.data(stringifiedHiddenFiles).trace('Hidden files saved')
            }
        }
    )
}
