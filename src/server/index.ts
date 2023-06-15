import { loadBundledEnvironment } from './bundled-environment'
import { SettingsPersistenceService } from './services/settings-persistence-service'
import { HiddenFilesPersistenceService } from './services/hidden-files-persistence-service'
import { serverInit } from './handlers/express-handler'
import { casparCgClient } from './handlers/caspar-cg-handler'
import { logger } from './utils/logger'

loadBundledEnvironment()
SettingsPersistenceService.instance.load()
HiddenFilesPersistenceService.instance.load()
serverInit()
casparCgClient()

process.on('unhandledRejection', (error) => processUnhandledRejection(error))
function processUnhandledRejection(error: unknown) {
    logger.data(error).error('Caught Unhandled Rejection Error: ')
    throw error
}
