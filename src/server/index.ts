import { loadBundledEnvironment } from './bundled-environment'
import settingsPersistenceService from './services/settingsPersistenceService'
import hiddenFilesPersistenceService from './services/hiddenFilesPersistenceService'
import { serverInit } from './handlers/expressHandler'
import { casparCgClient } from './handlers/casparCgHandler'

loadBundledEnvironment()
settingsPersistenceService.load()
hiddenFilesPersistenceService.load()
serverInit()
casparCgClient()
