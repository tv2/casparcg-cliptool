//System:
import net from 'net' // Used for TCP log server

//Modules:
import { CasparCG } from 'casparcg-connection'

//Utils:
import {
    cleanUpFilename,
    extractFilenameFromPath,
} from './utils/filePathStringHandling'
import { generateCcgDataStructure } from './utils/ccgDatasctructure'
import { readCasparCgConfigFile } from './utils/casparCGconfigFileReader'
import { OscServer } from './OscServer'
import { CcgGraphQlServer } from './GraphQlServer'
import {
    mediaFileWatchSetup,
    mediaFolderWatchSetup,
    dataFolderWatchSetup,
    templateFolderWatchSetup,
} from './FileFolderWatchers'

//Types:
import * as DEFAULTS from './utils/CONSTANTS'
import { ICcgChannels } from './utils/ccgDatasctructure'

//GraphQl:
import { PubSub } from 'apollo-server'

export class App {
    pubsub: PubSub
    ccgConnection: CasparCG
    configFile: any
    ccgNumberOfChannels: number
    ccgChannel: ICcgChannels
    waitingForResponse: boolean = false

    constructor() {
        //Binds:
        this.connectLog = this.connectLog.bind(this)
        this.startTimerControlledServices = this.startTimerControlledServices.bind(
            this
        )

        //PubSub:
        this.pubsub = new PubSub()

        //Setup AMCP Connection:
        this.ccgConnection = new CasparCG({
            host: DEFAULTS.CCG_HOST,
            port: DEFAULTS.CCG_AMCP_PORT,
            autoConnect: true,
        })

        //Define vars:
        this.configFile = readCasparCgConfigFile()
        this.ccgNumberOfChannels =
            this.configFile.configuration.channels.channel.length || 1
        this.ccgChannel = generateCcgDataStructure(this.ccgNumberOfChannels, 30)

        //Setup folder watchers :
        mediaFolderWatchSetup(
            this.configFile.configuration.paths['media-path']._text
        )
        dataFolderWatchSetup(
            this.configFile.configuration.paths['data-path']._text
        )
        templateFolderWatchSetup(
            this.configFile.configuration.paths['template-path']._text
        )

        //Setup GraphQL:
        global.graphQlServer = new CcgGraphQlServer(
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
                global.oscServer = new OscServer(
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

    updateData(channel: number) {
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
                    ].foreground.name = extractFilenameFromPath(
                        response.response.data.foreground.producer.filename
                    )
                    this.ccgChannel[channel - 1].layer[
                        DEFAULTS.CCG_DEFAULT_LAYER - 1
                    ].background.name = extractFilenameFromPath(
                        response.response.data.background.producer.filename ||
                            ''
                    )
                    this.ccgChannel[channel - 1].layer[
                        DEFAULTS.CCG_DEFAULT_LAYER - 1
                    ].foreground.path = cleanUpFilename(
                        response.response.data.foreground.producer.filename
                    )
                    this.ccgChannel[channel - 1].layer[
                        DEFAULTS.CCG_DEFAULT_LAYER - 1
                    ].background.path = cleanUpFilename(
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
        const casparLogClient = new net.Socket()

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

    connectLog(port: number, host: string, client: any) {
        client.connect(port, host, () => {
            console.log('CasparLogClient connected to: ' + host + ':' + port)
        })
    }

    readLogChannel(data: string, commandName: string) {
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
