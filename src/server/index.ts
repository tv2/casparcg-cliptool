/*
import { reduxState, reduxStore } from '../model/reducers/store'
import * as DEFAULTS from './utils/CONSTANTS'
*/

import { serverInit } from './handlers/expressHandler'
serverInit()

import { casparCgClient } from './handlers/CasparCgHandler'
casparCgClient()
