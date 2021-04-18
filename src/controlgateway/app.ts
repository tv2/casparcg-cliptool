import { oscServerGateway } from './gateways/OscServerGateway'
export const app = () => {
    console.log('ControlGateway started')
    let type = process.argv
        .find((arg) => {
            return arg.includes('type')
        })
        .split('=')[1]
    if (type === 'osc') {
        oscServerGateway()
    } else {
        console.log(`you must add type=osc or type=xxxx`)
        process.exit(0)
    }
}
