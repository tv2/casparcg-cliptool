import { ampServerGateway } from './gateways/AmpServerGateway'
import { oscServerGateway } from './gateways/OscServerGateway'
import { argHelp, ARG_CONSTANTS } from './util/extractArgs'
import { logger } from './util/loggerGateway'

export const app = () => {
    logger.info('ControlGateway started')

    switch (ARG_CONSTANTS.type) {
        case 'osc':
            oscServerGateway()
            break
        case 'amp':
            ampServerGateway()
            break
        default:
            argHelp()
            process.exit(0)
    }
}
