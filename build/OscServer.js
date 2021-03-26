'use strict'
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              Object.defineProperty(o, k2, {
                  enumerable: true,
                  get: function () {
                      return m[k]
                  },
              })
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              o[k2] = m[k]
          })
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, 'default', {
                  enumerable: true,
                  value: v,
              })
          }
        : function (o, v) {
              o['default'] = v
          })
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod
        var result = {}
        if (mod != null)
            for (var k in mod)
                if (
                    k !== 'default' &&
                    Object.prototype.hasOwnProperty.call(mod, k)
                )
                    __createBinding(result, mod, k)
        __setModuleDefault(result, mod)
        return result
    }
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod }
    }
Object.defineProperty(exports, '__esModule', { value: true })
exports.OscServer = void 0
//Node Modules:
const os_1 = __importDefault(require('os')) // Used to display (log) network addresses on local machine
const osc_1 = __importDefault(require('osc')) //Using OSC fork from PieceMeta/osc.js as it has excluded hardware serialport support and thereby is crossplatform
//Types:
const DEFAULTS = __importStar(require('./utils/CONSTANTS'))
const ccgDatasctructure_1 = require('./utils/ccgDatasctructure')
class OscServer {
    constructor(pubsub, ccgChannel, ccgNumberOfChannels) {
        this.pubsub = pubsub
        this.ccgChannel = ccgChannel
        this.ccgNumberOfChannels = ccgNumberOfChannels
        this.setupOscServer()
    }
    setupOscServer() {
        let _this2 = this
        const oscConnection = new osc_1.default.UDPPort({
            localAddress: '0.0.0.0',
            localPort: DEFAULTS.DEFAULT_OSC_PORT,
        })
        oscConnection
            .on('ready', () => {
                let ipAddresses = this.getThisMachineIpAddresses()
                console.log('Listening for OSC over UDP.')
                ipAddresses.forEach((address) => {
                    console.log(
                        'OSC Host:',
                        address + ', Port:',
                        oscConnection.options.localPort
                    )
                })
            })
            .on('message', (message) => {
                let channelIndex = this.findChannelNumber(message.address) - 1
                let layerIndex = this.findLayerNumber(message.address) - 1
                if (message.address.includes('/stage/layer')) {
                    //CCG 2.2 Handle OSC /file/path:
                    if (message.address.includes('foreground/file/path')) {
                        if (
                            _this2.ccgChannel[channelIndex].layer[layerIndex]
                                .foreground.path != message.args[0]
                        ) {
                            _this2.ccgChannel[channelIndex].layer[
                                layerIndex
                            ].foreground.path = message.args[0]
                            _this2.publishInfoUpdate(channelIndex)
                        }
                    }
                    if (message.address.includes('background/file/path')) {
                        if (
                            _this2.ccgChannel[channelIndex].layer[layerIndex]
                                .background.path != message.args[0]
                        ) {
                            _this2.ccgChannel[channelIndex].layer[
                                layerIndex
                            ].background.path = message.args[0]
                            _this2.publishInfoUpdate(channelIndex)
                        }
                    }
                    if (message.address.includes('foreground/file/name')) {
                        _this2.ccgChannel[channelIndex].layer[
                            layerIndex
                        ].foreground.name = message.args[0]
                    }
                    if (message.address.includes('background/file/name')) {
                        _this2.ccgChannel[channelIndex].layer[
                            layerIndex
                        ].background.name = message.args[0]
                    }
                    if (message.address.includes('file/time')) {
                        _this2.ccgChannel[channelIndex].layer[
                            layerIndex
                        ].foreground.time = message.args[0]
                        _this2.ccgChannel[channelIndex].layer[
                            layerIndex
                        ].foreground.length = message.args[1]
                    }
                    if (message.address.includes('loop')) {
                        _this2.ccgChannel[channelIndex].layer[
                            layerIndex
                        ].foreground.loop = message.args[0]
                    }
                    if (message.address.includes('/paused')) {
                        _this2.ccgChannel[channelIndex].layer[
                            layerIndex
                        ].foreground.paused = message.args[0]
                    }
                    //CCG 2.1 Handle OSC /file/path:
                    if (
                        message.address.includes('file/path') &&
                        global.serverVersion < '2.2'
                    ) {
                        if (
                            _this2.ccgChannel[channelIndex].layer[layerIndex]
                                .foreground.name != message.args[0]
                        ) {
                            _this2.ccgChannel[channelIndex].layer[
                                layerIndex
                            ].foreground.name = message.args[0]
                            _this2.ccgChannel[channelIndex].layer[
                                layerIndex
                            ].foreground.path = message.args[0]
                            _this2.publishInfoUpdate(channelIndex)
                        }
                    }
                }
            })
            .on('error', (error) => {
                console.log('OSC error :', error)
            })
        oscConnection.open()
        console.log(`OSC listening on port 5253`)
    }
    publishInfoUpdate(channelIndex) {
        let channelsPlaylayer = ccgDatasctructure_1.generateCcgDataStructure(
            this.ccgNumberOfChannels,
            1
        )
        for (let i = 0; i < this.ccgNumberOfChannels; i++) {
            channelsPlaylayer[i].layer[0] = this.ccgChannel[i].layer[
                DEFAULTS.CCG_DEFAULT_LAYER - 1
            ]
        }
        console.log('Pubsub data PlayLayer : ', channelsPlaylayer)
        this.pubsub.publish(DEFAULTS.PUBSUB_PLAY_LAYER_UPDATED, {
            playLayer: channelsPlaylayer,
        })
        this.pubsub.publish(DEFAULTS.PUBSUB_INFO_UPDATED, {
            infoChannelUpdated: channelIndex,
        })
        this.pubsub.publish(DEFAULTS.PUBSUB_CHANNELS_UPDATED, {
            channels: this.ccgChannel,
        })
    }
    getThisMachineIpAddresses() {
        let interfaces = os_1.default.networkInterfaces()
        let ipAddresses = []
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
    findChannelNumber(string) {
        let channel = string.replace('/channel/', '')
        channel = channel.slice(0, channel.indexOf('/'))
        return parseInt(channel)
    }
    findLayerNumber(string) {
        let channel = string.slice(string.indexOf('layer/') + 6)
        channel = channel.slice(0, channel.indexOf('/'))
        return parseInt(channel)
    }
}
exports.OscServer = OscServer
//# sourceMappingURL=OscServer.js.map
