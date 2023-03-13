import { setGenerics } from '../../model/reducers/settingsAction'
import {
    defaultSettingsReducerState,
    GenericSettings,
} from '../../model/reducers/settingsReducer'
import { reduxState, reduxStore } from '../../model/reducers/store'
import settingsFileService from '../../model/services/settingsFileService'
import { logger } from './logger'

const fs = require('fs')
const path = require('path')

export const loadSettings = () => {
    const defaultGenerics = settingsFileService.getDefaultGenericSettings()
    try {
        const settingsFromFile = JSON.parse(
            fs.readFileSync(path.resolve('storage', 'settings.json'))
        )
        let settings: GenericSettings = null
        let hasStructureBeenCorrected = false
        const isOld = settingsFileService.isPreviousStructure(settingsFromFile)
        if (isOld.success) {
            logger.warn(
                'Old settings structure detected - updating it to the new structure.'
            )
            settings = settingsFileService.getCorrectedStructureFromOld(
                isOld.parsed
            )
            hasStructureBeenCorrected = true
        } else {
            const isNew = settingsFileService.isNewStructure(settingsFromFile)
            if (isNew.success) {
                settings = isNew.parsed
            } else {
                logger
                    .data(settingsFromFile)
                    .error('Failed to parse settings from file, using default!')
                settings = defaultGenerics
            }
        }

        logger.data(settingsFromFile).info('File loaded with settings:')
        reduxStore.dispatch(setGenerics(settings))
        if (hasStructureBeenCorrected) {
            logger.info('New Settings structure generated, saving Settings...')
            saveSettings()
        }
    } catch (error) {
        logger.warn(
            'Settings not found, or not yet stored, dispatching defaults, and saving it.'
        )
        reduxStore.dispatch(setGenerics(defaultGenerics))
        saveSettings()
    }
}

export const saveSettings = () => {
    const generics: GenericSettings = reduxState.settings[0].generics
    const stringifiedSettings = JSON.stringify(generics)
    if (!fs.existsSync('storage')) {
        fs.mkdirSync('storage')
    }
    fs.writeFile(
        path.resolve('storage', 'settings.json'),
        stringifiedSettings,
        'utf8',
        (error) => {
            if (error) {
                logger.data(error).error('Error writing file:')
            } else {
                logger.data(stringifiedSettings).info('Settings saved')
            }
        }
    )
}
