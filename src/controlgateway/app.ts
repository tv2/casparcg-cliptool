import { oscServerGateway } from './gateways/OscServerGateway'
export const app = () => {
    console.log('ControlGateway started')
    oscServerGateway()
}
