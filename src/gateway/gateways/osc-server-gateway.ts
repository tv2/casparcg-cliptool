// @ts-ignore
import osc from 'osc' //Using OSC fork from PieceMeta/osc.js as it has excluded hardware serialport support and thereby is crossplatform

import { state } from '../../model/reducers/store'
import { socket } from '../util/socket-gateway-handlers'

import * as OSC from './osc-constants'
import { ARG_CONSTANTS } from '../util/extract-args'
import osService from '../../model/services/os-service'
import mediaService from '../../model/services/media-service'
import { ClientToServer } from '../../model/socket-io-constants'

export function oscServerGateway(): void {
    console.log('Initializing OSC server')
    const oscConnection = new osc.UDPPort({
        localAddress: '0.0.0.0',
        localPort: ARG_CONSTANTS.oscPort,
    })

    oscConnection
        .on('ready', () => {
            let ipAddresses = osService.getThisMachineIpAddresses()

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
                socket.emit(
                    ClientToServer.PGM_PLAY,
                    channel - 1,
                    message.args[0]
                )
            } else if (checkOscCommand(message.address, OSC.PGM_CUE)) {
                console.log(`LOAD ${message.address} ${message.args[0]}`)
                socket.emit(
                    ClientToServer.PGM_LOAD,
                    channel - 1,
                    message.args[0]
                )
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
                                mediaService.getOutput(state, channel - 1)
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

function checkOscCommand(
    message: string,
    command: string | undefined
): boolean {
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
