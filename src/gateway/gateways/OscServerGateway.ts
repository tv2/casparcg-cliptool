import os from 'os' // Used to display (log) network addresses on local machine
import osc from 'osc' //Using OSC fork from PieceMeta/osc.js as it has excluded hardware serialport support and thereby is crossplatform

import { reduxState } from '../../model/reducers/store'
import { socket } from '../util/SocketGatewayHandlers'

import * as IO from '../../model/SocketIoConstants'
import * as OSC from './OscConstants'
import { ARG_CONSTANTS } from '../util/extractArgs'

export const oscServerGateway = () => {
    console.log('Initializing OSC server')
    const oscConnection = new osc.UDPPort({
        localAddress: '0.0.0.0',
        localPort: ARG_CONSTANTS.oscPort,
    })

    oscConnection
        .on('ready', () => {
            let ipAddresses = getThisMachineIpAddresses()

            console.log('Listening for OSC over UDP.')
            ipAddresses.forEach((address) => {
                console.log(
                    `OSC Host: ${address}, Port: ${oscConnection.options.localPort}`
                )
            })
        })
        .on('message', (message: any) => {
            console.log(
                `Received Command : ${message.address} ${message.args[0]} `
            )
            let channel = message.address.split('/')[2]
            if (checkOscCommand(message.address, OSC.PGM_PLAY)) {
                console.log(`PLAY ${message.address} ${message.args[0]}`)
                socket.emit(IO.PGM_PLAY, channel - 1, message.args[0])
            } else if (checkOscCommand(message.address, OSC.PGM_CUE)) {
                console.log(`LOAD ${message.address} ${message.args[0]}`)
                socket.emit(IO.PGM_LOAD, channel - 1, message.args[0])
            } else if (checkOscCommand(message.address, OSC.MEDIA)) {
                console.log(
                    `GET MEDIA OUTPUT: ${channel}  Command : ${message.address} `
                )
                oscConnection.send({
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
            }
        })
        .on('error', (error: any) => {
            console.log('error in OSC receive :', error)
        })

    oscConnection.open()
}

const checkOscCommand = (
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
