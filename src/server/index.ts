import { loadSettings } from './utils/SettingsStorage'
loadSettings()

import { serverInit } from './handlers/expressHandler'
serverInit()

import { casparCgClient } from './handlers/CasparCgHandler'
casparCgClient()
