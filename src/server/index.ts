import { loadBundledEnvironment } from './bundled-environment'
import settingsPersistenceService from './services/settings-persistence-service'
import hiddenFilesPersistenceService from './services/hidden-files-persistence-service'
import { serverInit } from './handlers/express-handler'
import { casparCgClient } from './handlers/caspar-cg-handler'

loadBundledEnvironment()
settingsPersistenceService.load()
hiddenFilesPersistenceService.load()
serverInit()
casparCgClient()
