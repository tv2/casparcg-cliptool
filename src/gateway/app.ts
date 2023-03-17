import { ampServerGateway } from './gateways/ampServerGateway'
import { oscServerGateway } from './gateways/oscServerGateway'
import { argHelp, ARG_CONSTANTS } from './util/extractArgs'

export function app() {
    console.log('ControlGateway started')

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
