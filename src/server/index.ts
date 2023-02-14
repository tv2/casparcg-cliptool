import { loadSettings } from './utils/SettingsStorage'
loadSettings()

import { loadHiddenFiles } from './utils/HiddenFilesStorage'
loadHiddenFiles()

import { serverInit } from './handlers/expressHandler'
serverInit()

import { casparCgClient } from './handlers/CasparCgHandler'
casparCgClient()
