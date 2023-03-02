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
    try {
        const settingsFromFile = JSON.parse(
            fs.readFileSync(path.resolve('storage', 'settings.json'))
        )
        logger.data(settingsFromFile).info('File loaded with settings:')
        reduxStore.dispatch(setGenerics(settingsFromFile))
        //socketServer.emit(IO.SETTINGS_UPDATE, reduxState.settings[0])
    } catch (error) {
        logger
            .data(error)
            .error('Settings not found, or not yet stored, using defaults')
    }
}

export const saveSettings = () => {
    const generics: IGenericSettings = reduxState.settings[0].generics
    const defaultGenerics: IGenericSettings =
        defaultSettingsReducerState()[0].generics
    const isStructureCorrect: boolean = verifyStructure(
        generics,
        defaultGenerics
    )
    const newGenerics: IGenericSettings = isStructureCorrect
        ? generics
        : correctStructure(generics, defaultGenerics)
    const stringifiedSettings = JSON.stringify(newGenerics)
    if (!fs.existsSync('storage')) {
        fs.mkdirSync('storage')
    }
    if (stringifiedSettings !== JSON.stringify(defaultGenerics)) {
        fs.writeFile(
            path.resolve('storage', 'settings.json'),
            stringifiedSettings,
            'utf8',
            (error) => {
                if (error) {
                    logger.data(error).error('Error writing file:')
                } else {
                    logger.data(stringifiedSettings).info('Settings saved')
                    if (!isStructureCorrect) {
                        logger.info(
                            'New Settings structure saved, reloading Settings...'
                        )
                        loadSettings()
                    }
                }
            }
        )
    } else {
        logger.info('Settings not saved, using defaults')
    }
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
        generics.startupManualstartState.length !==
            defaultGenerics.startupManualstartState.length ||
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
        generics.outputLabels = [
            ...generics.outputLabels,
            ...defaultGenerics.outputLabels.slice(
                generics.outputLabels.length -
                    defaultGenerics.outputLabels.length
            ),
        ]
    }
    if (
        generics.outputFolders.length !== defaultGenerics.outputFolders.length
    ) {
        generics.outputFolders = [
            ...generics.outputFolders,
            ...defaultGenerics.outputFolders.slice(
                generics.outputFolders.length -
                    defaultGenerics.outputFolders.length
            ),
        ]
    }
    if (generics.scale.length !== defaultGenerics.scale.length) {
        generics.scale = [
            ...generics.scale,
            ...defaultGenerics.scale.slice(
                generics.scale.length - defaultGenerics.scale.length
            ),
        ]
    }
    if (generics.scaleX.length !== defaultGenerics.scaleX.length) {
        generics.scaleX = [
            ...generics.scaleX,
            ...defaultGenerics.scaleX.slice(
                generics.scaleX.length - defaultGenerics.scaleX.length
            ),
        ]
    }
    if (generics.scaleY.length !== defaultGenerics.scaleY.length) {
        generics.scaleY = [
            ...generics.scaleY,
            ...defaultGenerics.scaleY.slice(
                generics.scaleY.length - defaultGenerics.scaleY.length
            ),
        ]
    }
    if (
        generics.startupLoopState.length !==
        defaultGenerics.startupLoopState.length
    ) {
        generics.startupLoopState = [
            ...generics.startupLoopState,
            ...defaultGenerics.startupLoopState.slice(
                generics.startupLoopState.length -
                    defaultGenerics.startupLoopState.length
            ),
        ]
    }
    if (
        generics.startupMixState.length !==
        defaultGenerics.startupMixState.length
    ) {
        generics.startupMixState = [
            ...generics.startupMixState,
            ...defaultGenerics.startupMixState.slice(
                generics.startupMixState.length -
                    defaultGenerics.startupMixState.length
            ),
        ]
    }
    if (
        generics.startupManualstartState.length !==
        defaultGenerics.startupManualstartState.length
    ) {
        generics.startupManualstartState = [
            ...generics.startupManualstartState,
            ...defaultGenerics.startupManualstartState.slice(
                generics.startupManualstartState.length -
                    defaultGenerics.startupManualstartState.length
            ),
        ]
    }
    if (
        generics.startupWebState.length !==
        defaultGenerics.startupWebState.length
    ) {
        generics.startupWebState = [
            ...generics.startupWebState,
            ...defaultGenerics.startupWebState.slice(
                generics.startupWebState.length -
                    defaultGenerics.startupWebState.length
            ),
        ]
    }
    if (generics.webURL.length !== defaultGenerics.webURL.length) {
        generics.webURL = [
            ...generics.webURL,
            ...defaultGenerics.webURL.slice(
                generics.webURL.length - defaultGenerics.webURL.length
            ),
        ]
    }
    if (
        generics.startupOperationMode.length !==
        defaultGenerics.startupOperationMode.length
    ) {
        generics.startupOperationMode = [
            ...generics.startupOperationMode,
            ...defaultGenerics.startupOperationMode.slice(
                generics.startupOperationMode.length -
                    defaultGenerics.startupOperationMode.length
            ),
        ]
    }

    return generics
}
