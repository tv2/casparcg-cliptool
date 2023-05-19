// This is a simple script to connect to the AMP logger and send commands to it
// for development purposes only

const socket = new require('net').Socket()

console.log('Connecting to AMP Server')

//socket.connect(3811, '10.208.3.21', () => {
socket.connect(3811, 'localhost', () => {
    console.log('Connected to AMP logger')

    sendMessage('CRAT', '204Vtr2')
    //    sendMessage('CMDS', 'A20E00130011564d5f4841414e44424f4c445f32303139')
    //    sendMessage('CMDS', 'AA1800190017323031395f73706f7274656e5f696e74726f5f736c7574')
    //sendMessage('CMDS','A20E000e000c323032335f43796b6c696e67')
    //sendMessage('CMDS','AA1800140012323032335f43796b6c696e675f4f7574726f')
    // sendMessage('CMDS','612041')

    commands = [
        /*        'CRAT0007204Vtr4',
        'CMDS0006413600',
        'CMDS0004A02A',

        'CMDS0036A20E000e000c323032335f43796b6c696e67',
        'CMDS0006612001',
        'CMDS0056AA1800180016323032335f43796b6c696e675f57697065666c617368',
        'CMDS0036A20E000e000c323032335f43796b6c696e67',
        'CMDS0006612001',
        'CMDS0048AA1800140012323032335f43796b6c696e675f4f7574726f',
        'CMDS0004A00F',
        'CMDS0004A016',
        'CMDS0006414200',
        'CMDS0006612041',
        */
        'CMDS0004A02B',
        'CMDS0004A02B',
        'CMDS0004A02B',
        'CMDS0004A02B',
        'CMDS0004A02B',
        'CMDS0004A02B',
        'CMDS0004A02B',
        'CMDS0004A026',
        'CMDS0006A11502',
        'CMDS0006A11502',
        'CMDS0006A11502',
        /*        'CMDS0004A02B',
        'CMDS0004A02C',
        'CMDS0004A00F',
        'CMDS0004A026',
        'CMDS0008A214',*/
    ]

    setInterval(() => {
        if (commands.length > 0) {
            console.log('CMD :', commands[0])
            socket.write(commands.shift() + '\n')
        }
    }, 500)

    socket.on('data', (data) => {
        console.log('K2 Response :', data.toString())
        console.log('')
    })
})

function sendMessage(cmdType, message) {
    console.log(message)
    const length = ('0000' + message.length).slice(-4)
    console.log('Sending :', cmdType + length + message + '\n')
    socket.write(cmdType + length + message + '\n')
}
