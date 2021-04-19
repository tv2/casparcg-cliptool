import { ARG_CONSTANTS } from './util/extractArgs'
import { logger } from './util/loggerGateway'

import { reduxState } from '../model/reducers/store'
import { app } from './app'
import { socket } from './util/SocketGatewayHandlers'

logger.info(` Runtime Arguments : ${ARG_CONSTANTS}`)

logger.info(`Redux initialized ${reduxState.settings[0].generics}`)
logger.info(`Socket Initialized`)

app()
