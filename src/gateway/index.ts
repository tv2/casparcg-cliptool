import { ARG_CONSTANTS } from './util/extractArgs'
import { logger } from './util/loggerGateway'

import { reduxState } from '../model/reducers/store'
import { app } from './app'

logger.data(ARG_CONSTANTS).info('Runtime Arguments:')

logger.data(reduxState.settings.generics).info('Redux initialized.')
logger.info(`Socket Initialized`)

app()
