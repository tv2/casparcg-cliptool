import { setGenerics } from '../../model/reducers/settingsAction'
import { defaultSettingsReducerState } from '../../model/reducers/settingsReducer'
import { reduxState, reduxStore } from '../../model/reducers/store'
import { logger } from './logger'

const fs = require('fs')
const path = require('path')

export const loadSettings = () => {
    try {
        const settingsFromFile = JSON.parse(
            fs.readFileSync(path.resolve('storage', 'settings.json'))
        )
        logger.data(settingsFromFile).info('File Loaded : ')
        reduxStore.dispatch(setGenerics(settingsFromFile))
    } catch (error) {
        logger.data(error).error('Settings not yet stored, using defaults')
    }
}

export const saveSettings = () => {
    const stringifiedSettings = JSON.stringify(reduxState.settings[0].generics)
    if (!fs.existsSync('storage')) {
        fs.mkdirSync('storage')
    }
    if (
        stringifiedSettings !==
        JSON.stringify(defaultSettingsReducerState()[0].generics)
    ) {
        fs.writeFile(
            path.resolve('storage', 'settings.json'),
            stringifiedSettings,
            'utf8',
            (error) => {
                logger.data(error).error('Error writing file :')
            }
        )
    } else {
        logger.info('Settings not saved, using defaults')
    }
}
