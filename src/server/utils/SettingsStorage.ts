import { verify } from 'crypto'
import { setGenerics } from '../../model/reducers/settingsAction'
import {
    defaultSettingsReducerState,
    IGenericSettings,
} from '../../model/reducers/settingsReducer'
import { reduxState, reduxStore } from '../../model/reducers/store'
import * as IO from '../../model/SocketIoConstants'
import { socketServer } from '../handlers/expressHandler'
import { logger } from './logger'

const fs = require('fs')
const path = require('path')

export const loadSettings = () => {
    const defaultGenerics: IGenericSettings =
        defaultSettingsReducerState()[0].generics
    try {
        const settingsFromFile: IGenericSettings = JSON.parse(
            fs.readFileSync(path.resolve('storage', 'settings.json'))
        )
        const isStructureCorrect: boolean = verifyStructure(
            settingsFromFile,
            defaultGenerics
        )
        const newGenerics: IGenericSettings = isStructureCorrect
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
    const generics: IGenericSettings = reduxState.settings[0].generics
    const defaultGenerics: IGenericSettings =
        defaultSettingsReducerState()[0].generics
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

function verifyStructure(
    generics: IGenericSettings,
    defaultGenerics: IGenericSettings
): boolean {
    if (
        generics.outputLabels.length !== defaultGenerics.outputLabels.length ||
        generics.outputFolders.length !==
            defaultGenerics.outputFolders.length ||
        generics.scale.length !== defaultGenerics.scale.length ||
        generics.scaleX.length !== defaultGenerics.scaleX.length ||
        generics.scaleY.length !== defaultGenerics.scaleY.length ||
        generics.startupLoopState.length !==
            defaultGenerics.startupLoopState.length ||
        generics.startupMixState.length !==
            defaultGenerics.startupMixState.length ||
        generics.startupManualStartState.length !==
            defaultGenerics.startupManualStartState.length ||
        generics.startupWebState.length !==
            defaultGenerics.startupWebState.length ||
        generics.webURL.length !== defaultGenerics.webURL.length ||
        generics.startupOperationMode.length !==
            defaultGenerics.startupOperationMode.length
    ) {
        return false
    }
    return true
}

function correctStructure(
    originalGenerics: IGenericSettings,
    defaultGenerics: IGenericSettings
): IGenericSettings {
    let generics = { ...originalGenerics }

    // It must be possible to do the following in a smaller way... Not sure how currently though.
    if (generics.outputLabels.length !== defaultGenerics.outputLabels.length) {
        generics.outputLabels = getCombinedArray(
            generics.outputLabels,
            defaultGenerics.outputLabels
        )
    }
    if (
        generics.outputFolders.length !== defaultGenerics.outputFolders.length
    ) {
        generics.outputFolders = getCombinedArray(
            generics.outputFolders,
            defaultGenerics.outputFolders
        )
    }
    if (generics.scale.length !== defaultGenerics.scale.length) {
        generics.scale = getCombinedArray(generics.scale, defaultGenerics.scale)
    }
    if (generics.scaleX.length !== defaultGenerics.scaleX.length) {
        generics.scaleX = getCombinedArray(
            generics.scaleX,
            defaultGenerics.scaleX
        )
    }
    if (generics.scaleY.length !== defaultGenerics.scaleY.length) {
        generics.scaleY = getCombinedArray(
            generics.scaleY,
            defaultGenerics.scaleY
        )
    }
    if (
        generics.startupLoopState.length !==
        defaultGenerics.startupLoopState.length
    ) {
        generics.startupLoopState = getCombinedArray(
            generics.startupLoopState,
            defaultGenerics.startupLoopState
        )
    }
    if (
        generics.startupMixState.length !==
        defaultGenerics.startupMixState.length
    ) {
        generics.startupMixState = getCombinedArray(
            generics.startupMixState,
            defaultGenerics.startupMixState
        )
    }
    if (
        generics.startupManualStartState.length !==
        defaultGenerics.startupManualStartState.length
    ) {
        generics.startupManualStartState = getCombinedArray(
            generics.startupManualStartState,
            defaultGenerics.startupManualStartState
        )
    }
    if (
        generics.startupWebState.length !==
        defaultGenerics.startupWebState.length
    ) {
        generics.startupWebState = getCombinedArray(
            generics.startupWebState,
            defaultGenerics.startupWebState
        )
    }
    if (generics.webURL.length !== defaultGenerics.webURL.length) {
        generics.webURL = getCombinedArray(
            generics.webURL,
            defaultGenerics.webURL
        )
    }
    if (
        generics.startupOperationMode.length !==
        defaultGenerics.startupOperationMode.length
    ) {
        generics.startupOperationMode = getCombinedArray(
            generics.startupOperationMode,
            defaultGenerics.startupOperationMode
        )
    }

    return generics
}

function getCombinedArray<T>(originalArray: T[], defaultArray: T[]) {
    return [
        ...originalArray,
        ...defaultArray.slice(originalArray.length - defaultArray.length),
    ]
}
