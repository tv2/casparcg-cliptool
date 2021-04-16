import os from 'os' // Used to display (log) network addresses on local machine
import osc from 'osc' //Using OSC fork from PieceMeta/osc.js as it has excluded hardware serialport support and thereby is crossplatform

import { reduxState } from '../../model/reducers/store'
import { socket } from '../util/SocketClientHandlers'

import * as IO from '../../model/SocketIoConstants'
import * as OSC from './OscConstants'

const OSC_PORT =
    process.argv
        .find((arg) => {
            return arg.includes('port')
        })
        .split('=')[1] || '5256'

export const oscServerGateway = () => {
    console.log('Initializing OSC server')
    const oscConnection = new osc.UDPPort({
        localAddress: '0.0.0.0',
        localPort: OSC_PORT,
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
            socket.emit(IO.GET_SETTINGS)
        })
        .on('message', (message: any) => {
            if (checkMessage(message, OSC.PGM_PLAY)) {
                console.log('Message ${message} received')
            }
            console.log('Client Connected to OSC Controller')
            socket.emit(IO.GET_SETTINGS)
        })
        .on('error', (error: any) => {
            console.log('error in OSC receive :', error)
        })

    oscConnection.open()
    console.log(`OSC listening on port: ${OSC_PORT}`)
}

const checkMessage = (message: string, command: string): string => {
    return 'ok'
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
