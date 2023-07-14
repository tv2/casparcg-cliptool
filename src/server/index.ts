import { loadBundledEnvironment } from './bundled-environment'
import { SettingsPersistenceService } from './services/settings-persistence-service'
import { HiddenFilesPersistenceService } from './services/hidden-files-persistence-service'
import { casparCgClient } from './handlers/caspar-cg-handler'
import { logger } from './utils/logger'
import { ExpressService } from './services/express-service'

loadBundledEnvironment()
const expressService = ExpressService.instance
expressService.serverInit()
new SettingsPersistenceService().load()
new HiddenFilesPersistenceService(expressService.getSocketServer()).load()
casparCgClient()

process.on('unhandledRejection', (error) => processUnhandledRejection(error))
function processUnhandledRejection(error: unknown) {
    logger.data(error).error('Caught Unhandled Rejection Error: ')
    throw error
}
