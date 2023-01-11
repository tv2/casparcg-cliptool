import os from 'os' // Used to display (log) network addresses on local machine

import { createServer } from 'net'

import { socket as socketio } from '../util/SocketGatewayHandlers'

import * as IO from '../../model/SocketIoConstants'
import { logger } from '../util/loggerGateway'

export const ampServerGateway = () => {
    console.log('Initializing AMP server')
    const ampConnection = createServer((client: any) => {
        console.log('Client Connected')
        let ccgCh = 1
        client
            .on('data', (data: any) => {
                let message = data.toString().slice(0, data.length - 1) // Remove \n

                console.log(`Received Command : `, message.toString())

                if (message.includes('Vtr')) {
                    ccgCh = parseInt(message.split('Vtr')[1]) || 1
                    console.log('CasparCG Channel set to ', ccgCh)
                }
                let channel = 1 // message.address.split('/')[2]
                if (message.includes('CMDS00042001')) {
                    console.log(`PLAY on channel ${ccgCh}`)
                    socketio.emit(IO.PGM_PLAY, channel - 1, '')
                }
            })
            .on('end', () => {
                logger.info('AMP Client disconnected')
            })
    }).listen(3811)
    let ipAddresses = getThisMachineIpAddresses()
    ipAddresses.forEach((address) => {
        logger.info(`AMP Host Listening for TCP at ${address}:3811.`)
    })
}

const getThisMachineIpAddresses = () => {
    let interfaces = os.networkInterfaces()
    let ipAddresses: Array<string> = []
    for (let deviceName in interfaces) {
        let addresses = interfaces[deviceName]
        for (let i = 0; i < addresses.length; i++) {
            let addressInfo = addresses[i]
            if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address)
            }
        }
    }
    return ipAddresses
}
