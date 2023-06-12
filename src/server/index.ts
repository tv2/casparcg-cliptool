import { loadBundledEnvironment } from './bundled-environment'
import settingsPersistenceService from './services/settings-persistence-service'
import hiddenFilesPersistenceService from './services/hidden-files-persistence-service'
import { serverInit } from './handlers/express-handler'
import { casparCgClient } from './handlers/caspar-cg-handler'
import { logger } from './utils/logger'

loadBundledEnvironment()
settingsPersistenceService.load()
hiddenFilesPersistenceService.load()
serverInit()
casparCgClient()

process.on('unhandledRejection', (error) => processUnhandledRejection(error))
function processUnhandledRejection(error: unknown) {
    logger.data(error).error('Caught Unhandled Rejection Error: ')
    throw error
}
