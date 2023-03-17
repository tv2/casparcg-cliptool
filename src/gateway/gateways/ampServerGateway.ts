import os from 'os' // Used to display (log) network addresses on local machine

import { createServer } from 'net'

import { socket as socketio } from '../util/socketGatewayHandlers'

import * as IO from '../../model/socketIoConstants'
import { logger } from '../util/loggerGateway'
import osService from '../../model/services/osService'

export function ampServerGateway(): void {
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
    let ipAddresses = osService.getThisMachineIpAddresses()
    ipAddresses.forEach((address) => {
        logger.info(`AMP Host Listening for TCP at ${address}:3811.`)
    })
}

// This is preparation for handling other commands in the AMP protocol.
// TODO: Make use of it.
function checkAmpCommand(
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
