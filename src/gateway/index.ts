import { ARG_CONSTANTS } from './util/extract-args'
import { logger } from './util/logger-gateway'

import { state } from '../model/reducers/store'
import { app } from './app'

logger.data(ARG_CONSTANTS).info('Runtime Arguments:')

logger.data(state.settings.generics).info('Redux initialized.')
logger.info(`Socket Initialized`)

app()
