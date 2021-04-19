import { oscServerGateway } from './gateways/OscServerGateway'
import { argHelper, ARG_CONSTANTS } from './util/extractArgs'
import { logger } from './util/loggerGateway'

export const app = () => {
    console.log('ControlGateway started')

    switch (ARG_CONSTANTS.type) {
        case 'osc':
            oscServerGateway()
            break
        case 'amp':
            logger.info('AMP Protocol, not yet implemented')
            break
        default:
            argHelper()
            process.exit(0)
    }
}
