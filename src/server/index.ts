import { loadBundledEnvironment } from './bundled-environment'
import { SettingsPersistenceService } from './services/settings-persistence-service'
import { HiddenFilesPersistenceService } from './services/hidden-files-persistence-service'
import { ccgOSCServer } from './handlers/caspar-cg-handler'
import { AmcpHandlerService } from './services/casparcg-handler-service'
import { logger } from './utils/logger'
import { ExpressService } from './services/express-service'
import { ReduxSettingsService } from '../shared/services/redux-settings-service'

const settingsPersistenceService = SettingsPersistenceService.instance
settingsPersistenceService.load().then(() => {
    const reduxSettingsService = new ReduxSettingsService()

    const expressService = ExpressService.instance
    const hiddenFilesPersistenceService = new HiddenFilesPersistenceService(
        expressService.getSocketServer(),
        reduxSettingsService
    )
    hiddenFilesPersistenceService.load()

    loadBundledEnvironment()

    expressService.serverInit()
    const amcpHandlerService = new AmcpHandlerService()
    amcpHandlerService.amcpHandler().then(() => {
        logger.info('Finished AMCP startup procedure.')
    })
    ccgOSCServer()
})

process.on('unhandledRejection', (error) => processUnhandledRejection(error))
function processUnhandledRejection(error: unknown) {
    logger.data(error).error('Caught Unhandled Rejection Error: ')
    throw error
}
