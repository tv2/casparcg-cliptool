import { loadBundledEnvironment } from './bundled-environment'
loadBundledEnvironment()

import { loadSettings } from './utils/SettingsStorage'
loadSettings()

import { loadHiddenFiles } from './utils/hiddenFilesStorage'
loadHiddenFiles()

import { serverInit } from './handlers/expressHandler'
serverInit()

import { casparCgClient } from './handlers/CasparCgHandler'
casparCgClient()
