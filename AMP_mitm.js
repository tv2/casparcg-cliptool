// This is a simple script to connect to the AMP logger and send commands to it
// for development purposes only

const net = require('net')

let socketConnectionIndex = 0
const vmx3811SocketServer = require('net').createServer(
    (vmx3811SocketReceiver) => {
        socketConnectionIndex += 1
        let thisConnectionIndex = socketConnectionIndex
        let connectionChannel = 0
        const k2SocketClient = new net.Socket()

        //k2SocketClient.connect(3811, '10.208.3.21', () => {
        k2SocketClient.connect(3812, 'localhost', () => {
            console.log('Connected to 3811 AMP logger')
            let k2WriteCache = []

            const k2CacheWriter = setInterval(() => {
                if (k2WriteCache.length > 0) {
                    k2SocketClient.write(k2WriteCache.shift())
                }
            }, 100)

            let vmxWriteCache = []
            const vmxCacheWriter = setInterval(() => {
                if (vmxWriteCache.length > 0) {
                    vmx3811SocketReceiver.write(vmxWriteCache.shift())
                }
            }, 100)

            let k2PreviousStoredLog = ''

            vmx3811SocketReceiver
                .on('data', (data) => {
                    if (data.toString().includes('Vtr')) {
                        console.log('Channel is', data.toString())
                        connectionChannel = parseInt(
                            data.toString().split('Vtr')[1].slice(0, 1)
                        )
                    }

                    if (
                        //                                                data.toString().includes('6120')
                        //                         &&
                        false &&
                        connectionChannel === 4 &&
                        //                        data.toString() !== 'CMDS0004A012\n' &&
                        //data.toString() !== 'CMDS0004A016f\n' &&
                        data.toString() !== 'CMDS000661200f\n' &&
                        data.toString() !== 'CMDS0006610C01\n'
                    ) {
                        if (data.toString().length > 16) {
                            console.log(
                                connectionChannel,
                                ': CMD :',
                                data.toString().slice(0, 12),
                                'Text :',
                                hexToAscii(data).slice(2)
                            )
                        } else {
                            console.log(
                                connectionChannel,
                                ': CMD :',
                                data.toString().slice(0, -1)
                            )
                        }
                    }

                    k2WriteCache.push(data)
                })
                .on('end', (data) => {
                    clearInterval(vmxCacheWriter)
                    if (connectionChannel === 4) {
                        console.log(
                            connectionChannel,
                            ': 3811 - VMX Connection closed'
                        )
                    }
                })
                .on('error', (data) => {
                    clearInterval(vmxCacheWriter)
                    console.log('3811 - VMX Connection Error')
                })
            k2SocketClient
                .on('data', (data) => {
                    if (data.toString() != k2PreviousStoredLog) {
                        if (
                            data.toString().includes('7120') |
                                data.toString().includes('7320') |
                                data.toString().includes('7404') &&
                            connectionChannel === 4 // &&
                            //!data.toString().includes('7404') && // 610C01 ---- TIME??
                            //                        data.toString() !== '811807' &&
                            //                        data.toString() !== '82130000' && //A012
                            //!data.toString().includes('7f2') // 61200f
                        ) {
                            k2PreviousStoredLog = data.toString()
                            if (data.toString().length > 16) {
                                console.log(
                                    /*                                connectionChannel,
                                ': K2 :',
*/
                                    data.toString()
                                    /*                                'Text :',
                                hexToAscii(data.slice(4))
*/
                                )
                            } else {
                                console.log(
                                    connectionChannel,
                                    ': K2 Response :',
                                    data.toString()
                                )
                            }
                            // console.log('')
                        }
                    }

                    let newData = data.toString()
                    vmxWriteCache.push(newData)
                })
                .on('end', (data) => {
                    clearInterval(vmxCacheWriter)
                    if (connectionChannel === 4) {
                        console.log('3811 - k2 Connection closed')
                    }
                })
                .on('error', (data) => {
                    clearInterval(vmxCacheWriter)
                    console.log('3811 - k2 Connection Error')
                })
        })
    }
)

const vmx49171SocketServer = require('net').createServer(
    (vmx2109SocketReceiver) => {
        const k2SocketClient = new net.Socket()
        k2SocketClient.connect(49171, '10.208.3.21', () => {
            //   k2SocketClient.connect(3812, 'localhost', () => {
            console.log('Connected to 49171 - AMP logger')

            let socketWriteCache = []
            const k2CacheWriter = setInterval(() => {
                if (socketWriteCache.length > 0) {
                    k2SocketClient.write(socketWriteCache.shift())
                }
            }, 100)

            let clientWriteCache = []
            const vmxCacheWriter = setInterval(() => {
                if (clientWriteCache.length > 0) {
                    vmx2109SocketReceiver.write(clientWriteCache.shift())
                }
            }, 100)
            vmx2109SocketReceiver
                .on('data', (data) => {
                    if (
                        data
                            .toString()
                            .includes('IGNORE_FOR_NOW_PublicKeyToken=null')
                    ) {
                        console.log('Initial 49171 connection received')
                        const newData =
                            'IGNORE_FOR_NOW WHAT EVER WORKS' +
                            '00 13 95 06 27 28 00 00 00 00 01 8b 08 00 45 00 ' +
                            '00 28 00 00 40 00 40 06 1e 2b 0a d0 03 dd 0a d0 ' +
                            '03 29 c0 13 0b 63 00 00 00 00 55 66 ff 2a 50 14 ' +
                            '00 00 73 23 00 00'
                        const hexValues = newData.split(' ')
                        const dataBuffer = new Buffer.from(
                            hexValues.map((val) => parseInt(val, 16))
                        )
                        //                        clientWriteCache.push(dataBuffer)
                    } else {
                        if (
                            !data.toString().includes('Credentials') &&
                            !data.toString().includes('PublicToken=') &&
                            !data.toString().includes('PublicKeyToken=')
                        ) {
                            console.log(
                                '49171 : Data from VMX :',
                                data.toString().slice(0, -1)
                            )
                            //                            socketWriteCache.push(data)
                        }
                    }
                })
                .on('end', (data) => {
                    clearInterval(vmxCacheWriter)
                    console.log('49171 - Client Connection closed')
                })
                .on('error', (data) => {
                    clearInterval(vmxCacheWriter)
                    console.log('49171 - Client Connection Error')
                })
            k2SocketClient
                .on('data', (data) => {
                    console.log(
                        '49171 : Response from K2 :',
                        data.toString().slice(0, -1)
                    )

                    clientWriteCache.push(data)
                })
                .on('end', (data) => {
                    clearInterval(vmxCacheWriter)
                    console.log('49171 - K2 Connection closed')
                })
                .on('error', (data) => {
                    clearInterval(vmxCacheWriter)
                    console.log('49191 - K2 Connection Error')
                })
        })
    }
)

vmx3811SocketServer.listen(3811)
console.log(`AMP vmx3811SocketServer Listening for TCP on Port: 3811`)

//vmx49171SocketServer.listen(49171)
//console.log(`AMP vmx2109SocketServer Listening for TCP on Port: 49171`)

function logger(msg, socketConnectionIndex) {
    setTimeout(() => {
        console.log(msg)
    }, 1000 * socketConnectionIndex)
}

function hexToAscii(hex) {
    let str = ''
    for (let n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.toString().substr(n, 2), 16))
    }
    return str
}

function asciiToHex(str) {
    let arr = []
    for (let n = 0, l = str.length; n < l; n++) {
        let hex = ('00' + Number(str.charCodeAt(n)).toString(16)).slice(-2)
        arr.push(hex)
    }
    return arr.join('')
}
