//Node Modules:
import os from 'os' // Used to display (log) network addresses on local machine
import osc from 'osc' //Using OSC fork from PieceMeta/osc.js as it has excluded hardware serialport support and thereby is crossplatform
import {
    mediaFolderWatchSetup,
    dataFolderWatchSetup,
    templateFolderWatchSetup,
} from '../utils/FileFolderWatchers'

//Types:
import * as DEFAULTS from '../utils/CONSTANTS'
import {
    ICcgChannels,
    generateCcgDataStructure,
} from '../../model/ccgDatasctructure'

import { readCasparCgConfigFile } from '../utils/casparCGconfigFileReader'

let configFile: any = readCasparCgConfigFile()
let ccgNumberOfChannels =
    configFile.configuration?.channels?.channel?.length || 1
let ccgChannel = generateCcgDataStructure(ccgNumberOfChannels, 30)

//Setup folder watchers :
mediaFolderWatchSetup(
    configFile.configuration?.paths['media-path']._text || '/'
)
dataFolderWatchSetup(configFile.configuration?.paths['data-path']._text || '/')
templateFolderWatchSetup(
    configFile.configuration?.paths['template-path']._text || '/'
)

//Modules:
import { CasparCG } from 'casparcg-connection'

//Setup AMCP Connection:
export const ccgConnection = new CasparCG({
    host: DEFAULTS.CCG_HOST,
    port: DEFAULTS.CCG_AMCP_PORT,
    autoConnect: true,
})

const setupOscServer = () => {
    let _this2 = this
    const oscConnection = new osc.UDPPort({
        localAddress: '0.0.0.0',
        localPort: DEFAULTS.DEFAULT_OSC_PORT,
    })

    oscConnection
        .on('ready', () => {
            let ipAddresses = getThisMachineIpAddresses()

            console.log('Listening for OSC over UDP.')
            ipAddresses.forEach((address) => {
                console.log(
                    'OSC Host:',
                    address + ', Port:',
                    oscConnection.options.localPort
                )
            })
        })
        .on('message', (message: any) => {
            let channelIndex = findChannelNumber(message.address) - 1
            let layerIndex = findLayerNumber(message.address) - 1

            if (message.address.includes('/stage/layer')) {
                //CCG 2.2 Handle OSC /file/path:
                if (message.address.includes('foreground/file/path')) {
                    if (
                        ccgChannel[channelIndex].layer[layerIndex].foreground
                            .path != message.args[0]
                    ) {
                        ccgChannel[channelIndex].layer[
                            layerIndex
                        ].foreground.path = message.args[0]
                        publishInfoUpdate(channelIndex)
                    }
                }
                if (message.address.includes('background/file/path')) {
                    if (
                        ccgChannel[channelIndex].layer[layerIndex].background
                            .path != message.args[0]
                    ) {
                        ccgChannel[channelIndex].layer[
                            layerIndex
                        ].background.path = message.args[0]
                        publishInfoUpdate(channelIndex)
                    }
                }
                if (message.address.includes('foreground/file/name')) {
                    ccgChannel[channelIndex].layer[layerIndex].foreground.name =
                        message.args[0]
                }
                if (message.address.includes('background/file/name')) {
                    ccgChannel[channelIndex].layer[layerIndex].background.name =
                        message.args[0]
                }
                if (message.address.includes('file/time')) {
                    ccgChannel[channelIndex].layer[layerIndex].foreground.time =
                        message.args[0]
                    ccgChannel[channelIndex].layer[
                        layerIndex
                    ].foreground.length = message.args[1]
                }
                if (message.address.includes('loop')) {
                    ccgChannel[channelIndex].layer[layerIndex].foreground.loop =
                        message.args[0]
                }
                if (message.address.includes('/paused')) {
                    ccgChannel[channelIndex].layer[
                        layerIndex
                    ].foreground.paused = message.args[0]
                }

                //CCG 2.1 Handle OSC /file/path:
                /*
                if (
                    message.address.includes('file/path')
                    && global.serverVersion < '2.2'
                ) {
                    if (
                        ccgChannel[channelIndex].layer[layerIndex]
                            .foreground.name != message.args[0]
                    ) {
                        ccgChannel[channelIndex].layer[
                            layerIndex
                        ].foreground.name = message.args[0]
                        ccgChannel[channelIndex].layer[
                            layerIndex
                        ].foreground.path = message.args[0]
                        publishInfoUpdate(channelIndex)
                    }
                }
*/
            }
        })
        .on('error', (error: any) => {
            console.log('OSC error :', error)
        })

    oscConnection.open()
    console.log(`OSC listening on port 5253`)
}

const publishInfoUpdate = (channelIndex: number) => {
    let channelsPlaylayer: ICcgChannels = generateCcgDataStructure(
        ccgNumberOfChannels,
        1
    )

    for (let i = 0; i < ccgNumberOfChannels; i++) {
        channelsPlaylayer[i].layer[0] =
            ccgChannel[i].layer[DEFAULTS.CCG_DEFAULT_LAYER - 1]
    }

    console.log('Pubsub data PlayLayer : ', channelsPlaylayer)

    /*
    this.pubsub.publish(DEFAULTS.PUBSUB_PLAY_LAYER_UPDATED, {
        playLayer: channelsPlaylayer,
    })
    this.pubsub.publish(DEFAULTS.PUBSUB_INFO_UPDATED, {
        infoChannelUpdated: channelIndex,
    })
    this.pubsub.publish(DEFAULTS.PUBSUB_CHANNELS_UPDATED, {
        channels: this.ccgChannel,
    })
    */
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

const findChannelNumber = (string: string): number => {
    let channel = string.replace('/channel/', '')
    channel = channel.slice(0, channel.indexOf('/'))
    return parseInt(channel)
}

const findLayerNumber = (string: string): number => {
    let channel = string.slice(string.indexOf('layer/') + 6)
    channel = channel.slice(0, channel.indexOf('/'))
    return parseInt(channel)
}

/*

const casparCGconnection = () => {
        //Check CCG Version and initialise OSC server:
        console.log('Checking CasparCG connection')
        ccgConnection
            .version()
            .then((response) => {
                console.log(
                    'AMCP connection established to: ',
                    DEFAULTS.CCG_HOST,
                    ':',
                    DEFAULTS.CCG_AMCP_PORT
                )
                console.log('CasparCG Server Version :', response.response.data)
                global.serverVersion = response.response.data

                if (global.serverVersion < '2.2') {
                    //TCP Log is used for triggering fetch of AMCP INFO on CCG 2.1
                    this.setupCasparTcpLogServer()
                    mediaFileWatchSetup(
                        this.configFile.configuration.paths['thumbnail-path']
                            ._text,
                        this.pubsub
                    )
                } else {
                    mediaFileWatchSetup(
                        this.configFile.configuration.paths['media-path']._text,
                        this.pubsub
                    )
                }
                //OSC server will not recieve data before a CCG connection is established:
                global.oscServer = new OscClient(
                    this.ccgChannel,
                    this.ccgNumberOfChannels
                )
            })
            .catch((error) => {
                console.log('No connection to CasparCG', error)
            })

        this.startTimerControlledServices()
    }
}

const    startTimerControlledServices = () => {
        //Update of timeleft is set to a default 40ms (same as 25FPS)
        const timeLeftSubscription = setInterval(() => {
            if (global.graphQlServer.getServerOnline()) {
                this.pubsub.publish(DEFAULTS.PUBSUB_TIMELEFT_UPDATED, {
                    timeLeft: this.ccgChannel,
                })
            }
        }, 40)
        //Check server online:
        const serverOnlineSubscription = setInterval(() => {
            if (!this.waitingForResponse) {
                this.waitingForResponse = true
                this.ccgConnection
                    .version()
                    .then(() => {
                        global.graphQlServer.setServerOnline(true)
                        this.waitingForResponse = false
                    })
                    .catch((error) => {
                        console.log('Server not connected :', error)
                        global.graphQlServer.setServerOnline(false)
                    })
            } else {
                console.log('Server not connected')
                global.graphQlServer.setServerOnline(false)
            }
        }, 3000)
    }

*/
export const casparCgClient = () => {
    setupOscServer()
}
