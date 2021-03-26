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
exports.App = void 0
//System:
const net_1 = __importDefault(require('net')) // Used for TCP log server
//Modules:
const casparcg_connection_1 = require('casparcg-connection')
//Utils:
const filePathStringHandling_1 = require('./utils/filePathStringHandling')
const ccgDatasctructure_1 = require('./utils/ccgDatasctructure')
const casparCGconfigFileReader_1 = require('./utils/casparCGconfigFileReader')
const OscServer_1 = require('./OscServer')
const GraphQlServer_1 = require('./GraphQlServer')
const FileFolderWatchers_1 = require('./FileFolderWatchers')
//Types:
const DEFAULTS = __importStar(require('./utils/CONSTANTS'))
//GraphQl:
const apollo_server_1 = require('apollo-server')
class App {
    constructor() {
        this.waitingForResponse = false
        //Binds:
        this.connectLog = this.connectLog.bind(this)
        this.startTimerControlledServices = this.startTimerControlledServices.bind(
            this
        )
        //PubSub:
        this.pubsub = new apollo_server_1.PubSub()
        //Setup AMCP Connection:
        this.ccgConnection = new casparcg_connection_1.CasparCG({
            host: DEFAULTS.CCG_HOST,
            port: DEFAULTS.CCG_AMCP_PORT,
            autoConnect: true,
        })
        //Define vars:
        this.configFile = casparCGconfigFileReader_1.readCasparCgConfigFile()
        this.ccgNumberOfChannels =
            this.configFile.configuration.channels.channel.length || 1
        this.ccgChannel = ccgDatasctructure_1.generateCcgDataStructure(
            this.ccgNumberOfChannels,
            30
        )
        //Setup folder watchers :
        FileFolderWatchers_1.mediaFolderWatchSetup(
            this.configFile.configuration.paths['media-path']._text
        )
        FileFolderWatchers_1.dataFolderWatchSetup(
            this.configFile.configuration.paths['data-path']._text
        )
        FileFolderWatchers_1.templateFolderWatchSetup(
            this.configFile.configuration.paths['template-path']._text
        )
        //Setup GraphQL:
        global.graphQlServer = new GraphQlServer_1.CcgGraphQlServer(
            this.pubsub,
            this.ccgChannel
        )
        //Check CCG Version and initialise OSC server:
        console.log('Checking CasparCG connection')
        this.ccgConnection
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
                    FileFolderWatchers_1.mediaFileWatchSetup(
                        this.configFile.configuration.paths['thumbnail-path']
                            ._text,
                        this.pubsub
                    )
                } else {
                    FileFolderWatchers_1.mediaFileWatchSetup(
                        this.configFile.configuration.paths['media-path']._text,
                        this.pubsub
                    )
                }
                //OSC server will not recieve data before a CCG connection is established:
                global.oscServer = new OscServer_1.OscServer(
                    this.pubsub,
                    this.ccgChannel,
                    this.ccgNumberOfChannels
                )
            })
            .catch((error) => {
                console.log('No connection to CasparCG', error)
            })
        this.startTimerControlledServices()
    }
    startTimerControlledServices() {
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
    // Rest of the code is for
    // CCG 2.1 compatibility
    // And wil be maintanied as long as needed:
    updateData(channel) {
        return new Promise((resolve, reject) => {
            if (channel > this.ccgNumberOfChannels) {
                resolve(true)
                return
            }
            this.ccgConnection
                .info(channel, DEFAULTS.CCG_DEFAULT_LAYER)
                .then((response) => {
                    this.ccgChannel[channel - 1].layer[
                        DEFAULTS.CCG_DEFAULT_LAYER - 1
                    ].foreground.name = filePathStringHandling_1.extractFilenameFromPath(
                        response.response.data.foreground.producer.filename
                    )
                    this.ccgChannel[channel - 1].layer[
                        DEFAULTS.CCG_DEFAULT_LAYER - 1
                    ].background.name = filePathStringHandling_1.extractFilenameFromPath(
                        response.response.data.background.producer.filename ||
                            ''
                    )
                    this.ccgChannel[channel - 1].layer[
                        DEFAULTS.CCG_DEFAULT_LAYER - 1
                    ].foreground.path = filePathStringHandling_1.cleanUpFilename(
                        response.response.data.foreground.producer.filename
                    )
                    this.ccgChannel[channel - 1].layer[
                        DEFAULTS.CCG_DEFAULT_LAYER - 1
                    ].background.path = filePathStringHandling_1.cleanUpFilename(
                        response.response.data.background.producer.filename ||
                            ''
                    )
                    this.updateData(channel + 1).then(() => {
                        resolve(true)
                    })
                })
                .catch((error) => {
                    console.log(error)
                    reject(false)
                })
        })
    }
    setupCasparTcpLogServer() {
        //Setup TCP errorlog reciever:
        const casparLogClient = new net_1.default.Socket()
        this.connectLog(
            DEFAULTS.CCG_LOG_PORT,
            DEFAULTS.CCG_HOST,
            casparLogClient
        )
        casparLogClient.on('error', (error) => {
            console.log(
                'WARNING: LOAD and LOADBG commands will not update state as the'
            )
            console.log(
                'CasparCG server is offline or TCP log is not enabled in config',
                error
            )
            console.log(
                'casparcg tcp log should be set to IP: ' +
                    DEFAULTS.CCG_HOST +
                    ' Port : ' +
                    DEFAULTS.CCG_LOG_PORT
            )
            global.graphQlServer.setServerOnline(false)
            let intervalConnect = setTimeout(
                () =>
                    this.connectLog(
                        DEFAULTS.CCG_LOG_PORT,
                        DEFAULTS.CCG_HOST,
                        casparLogClient
                    ),
                5000
            )
        })
        casparLogClient.on('data', (data) => {
            if (
                data.includes('LOADBG ') ||
                data.includes('LOAD ') ||
                data.includes('PLAY ')
            ) {
                console.log('New LOG line: ', data.toString())
                this.updateData(1).then(() => {
                    let channel = this.readLogChannel(data.toString(), 'LOAD')
                    if (channel > 0) {
                        global.oscServer.pulishInfoUpdate(
                            channel,
                            this.ccgChannel
                        )
                    }
                })
            }
        })
    }
    connectLog(port, host, client) {
        client.connect(port, host, () => {
            console.log('CasparLogClient connected to: ' + host + ':' + port)
        })
    }
    readLogChannel(data, commandName) {
        let amcpCommand = data.substr(data.indexOf(commandName))
        let amcpChannel = parseInt(
            amcpCommand.substr(
                amcpCommand.indexOf(' ') + 1,
                amcpCommand.indexOf('-') - 1
            )
        )
        let amcpLayer = parseInt(
            amcpCommand.substr(amcpCommand.indexOf('-') + 1, 2)
        )
        let nameStart = amcpCommand.indexOf('"', 1)
        let nameEnd = amcpCommand.indexOf('"', nameStart + 1)
        return amcpChannel
    }
}
exports.App = App
//# sourceMappingURL=app.js.map
