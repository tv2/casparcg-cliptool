import { setGenerics } from '../../model/reducers/settingsAction'
import {
    defaultSettingsReducerState,
    GenericSettings,
} from '../../model/reducers/settingsReducer'
import { reduxState, reduxStore } from '../../model/reducers/store'
import { logger } from './logger'

const fs = require('fs')
const path = require('path')

export const loadSettings = () => {
    const defaultGenerics: GenericSettings =
        defaultSettingsReducerState()[0].generics
    try {
        const settingsFromFile: GenericSettings = JSON.parse(
            fs.readFileSync(path.resolve('storage', 'settings.json'))
        )
        const isStructureCorrect: boolean = verifyStructure(settingsFromFile)
        const newGenerics: GenericSettings = isStructureCorrect
            ? settingsFromFile
            : correctStructure(settingsFromFile, defaultGenerics)
        logger.data(settingsFromFile).info('File loaded with settings:')
        reduxStore.dispatch(setGenerics(newGenerics))
        if (!isStructureCorrect) {
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

// TODO: Re-implement function following new GenericSettings structure.
function verifyStructure(settings: GenericSettings): boolean {
    if (settings.outputs.length !== 8) {
        return false
    }
    return settings.outputs.some((output) => {
        if (output.folder === undefined || output.label === undefined) {
            return false
        }
        return true
    })
}

// TODO: Re-implement function following new GenericSettings structure.
function correctStructure(
    originalSettings: GenericSettings,
    defaultSettings: GenericSettings
): GenericSettings {
    let generics = { ...originalSettings }

    // It must be possible to do the following in a smaller way... Not sure how currently though.

    return generics
}
