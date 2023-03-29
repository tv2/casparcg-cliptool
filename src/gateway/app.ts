import { ampServerGateway } from './gateways/amp-server-gateway'
import { oscServerGateway } from './gateways/osc-server-gateway'
import { argHelp, ARG_CONSTANTS } from './util/extract-args'

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
