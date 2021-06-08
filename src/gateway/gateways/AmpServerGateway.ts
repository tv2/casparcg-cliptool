import os from 'os' // Used to display (log) network addresses on local machine

import { createServer } from 'net'

import { reduxState } from '../../model/reducers/store'
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
        logger.info(`AMP Host Listening for TCP at: ${address}, Port: 3811`)
    })
}

const checkAmpCommand = (
    message: string,
    command: string | undefined
): boolean => {
    if (!command || !message) return false
    if (message === command) return true
    let messageArray: string[] = message.split('/')
    let commandArray: string[] = command.split('/')
    let status: boolean = true
    if (messageArray.length !== commandArray.length) {
        return false
    }
    commandArray.forEach((commandPart: string, index: number) => {
        if (commandPart === '{output}') {
            if (typeof parseFloat(messageArray[index]) !== 'number') {
                status = false
            }
        } else if (commandPart !== messageArray[index]) {
            status = false
        }
    })
    return status
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
