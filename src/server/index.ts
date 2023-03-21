import { loadBundledEnvironment } from './bundled-environment'
loadBundledEnvironment()

import settingsPersistenceService from './services/settingsPersistenceService'
settingsPersistenceService.load()

import hiddenFilesPersistenceService from './services/hiddenFilesPersistenceService'
hiddenFilesPersistenceService.load()

import { serverInit } from './handlers/expressHandler'
serverInit()

import { casparCgClient } from './handlers/casparCgHandler'
casparCgClient()
