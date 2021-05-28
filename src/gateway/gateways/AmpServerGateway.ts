import os from 'os' // Used to display (log) network addresses on local machine
import { Server } from 'net'

import { reduxState } from '../../model/reducers/store'
import { socket as socketio } from '../util/SocketGatewayHandlers'

import * as IO from '../../model/SocketIoConstants'
import { logger } from '../util/loggerGateway'

export const ampServerGateway = () => {
    console.log('Initializing AMP server')
    const ampConnection = new Server()

    ampConnection
        .on('ready', () => {
            logger.info('AMP Server Ready')
        })
        .on('message', (message: any) => {
            console.log(`Received Command : `, message.toString())
            let channel = message.address.split('/')[2]
            if (checkAmpCommand(message.address, 'OSC.PGM_PLAY')) {
                console.log(`PLAY ${message.address} ${message.args[0]}`)
                socketio.emit(IO.PGM_PLAY, channel - 1, message.args[0])
            } else if (checkAmpCommand(message.address, 'OSC.PGM_CUE')) {
                console.log(`LOAD ${message.address} ${message.args[0]}`)
                socketio.emit(IO.PGM_LOAD, channel - 1, message.args[0])
            } else if (checkAmpCommand(message.address, 'OSC.MEDIA')) {
                console.log(
                    `GET MEDIA OUTPUT: ${channel}  Command : ${message.address} `
                )
                ampConnection.emit(
                    JSON.stringify({
                        address: message.address,
                        args: [
                            {
                                type: 's',
                                value: JSON.stringify(
                                    reduxState.media[0].output[channel - 1]
                                        .mediaFiles
                                ),
                            },
                        ],
                    })
                )
            }
        })
        .on('error', (error: any) => {
            console.log('error in AMP receive :', error)
        })

    let ipAddresses = getThisMachineIpAddresses()
    ipAddresses.forEach((address) => {
        logger.info(`AMP Host Listening for TCP at: ${address}, Port: 3811`)
    })
    ampConnection.listen(3811)
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
