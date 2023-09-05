import { loadBundledEnvironment } from './bundled-environment'
import { SettingsPersistenceService } from './services/settings-persistence-service'
import { HiddenFilesPersistenceService } from './services/hidden-files-persistence-service'
import { casparCgClient } from './handlers/caspar-cg-handler'
import { logger } from './utils/logger'
import { ExpressService } from './services/express-service'
import { ReduxSettingsService } from '../shared/services/redux-settings-service'

const reduxSettingsService: ReduxSettingsService = new ReduxSettingsService()
const expressService: ExpressService = ExpressService.instance
const hiddenFilesPersistenceService: HiddenFilesPersistenceService =
    new HiddenFilesPersistenceService(
        expressService.getSocketServer(),
        reduxSettingsService
    )
const settingsPersistenceService: SettingsPersistenceService =
    new SettingsPersistenceService(reduxSettingsService)

loadBundledEnvironment()
expressService.serverInit()
settingsPersistenceService.load()
hiddenFilesPersistenceService.load()
casparCgClient()

process.on('unhandledRejection', (error) => processUnhandledRejection(error))
function processUnhandledRejection(error: unknown) {
    logger.data(error).error('Caught Unhandled Rejection Error: ')
    throw error
}
