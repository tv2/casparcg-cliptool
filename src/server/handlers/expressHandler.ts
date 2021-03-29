import { logger } from '../utils/logger'
import { socketIoHandlers } from './socketIOHandler'

const express = require('express')
const path = require('path')
const app = express()
const server = require('http').Server(app)
const SERVER_PORT = 80
export const socketServer = require('socket.io')(server)

app.use('/', express.static(path.join(__dirname, '..')))
server.listen(SERVER_PORT)
logger.info(`Server started at http://localhost:${SERVER_PORT}`)

server.on('connection', () => {
    app.get('/', (req: any, res: any) => {
        res.sendFile(path.resolve('dist/index.html'))
    })
})

socketServer.on('connection', (socket: any) => {
    logger.info('Client connected :' + String(socket.client.id), {})
    socketIoHandlers(socket)
})

export const serverInit = () => {
    logger.info('Initialising WebServer')
}
/*

                    subscribe: () =>
                            DEFAULTS.PUBSUB_CHANNELS_UPDATED,
                    subscribe: () =>
                            DEFAULTS.PUBSUB_PLAY_LAYER_UPDATED,
                infoChannelUpdated: {
                    subscribe: () =>
                            DEFAULTS.PUBSUB_INFO_UPDATED,
                timeLeft: {
                            DEFAULTS.PUBSUB_TIMELEFT_UPDATED,
                mediaFilesChanged: {
                            DEFAULTS.PUBSUB_MEDIA_FILE_CHANGED,
            Query: {
                channels: () => {
                    return this.ccgChannel
                },
                layer: (obj: any, args: any, context: any, info: any) => {
                    const ccgLayerString = JSON.stringify(
                        this.ccgChannel[args.ch - 1].layer[args.l - 1]
                    )
                    return ccgLayerString
                },
                timeLeft: (obj: any, args: any, context: any, info: any) => {
                    return (
                        this.ccgChannel[args.ch - 1].layer[args.l - 1]
                            .foreground.length -
                        this.ccgChannel[args.ch - 1].layer[args.l - 1]
                            .foreground.time
                    )
                },
                serverOnline: () => {
                    return this.getServerOnline()
                },
                mediaFolders: () => {
                    return global.mediaFolders
                },
                dataFolders: () => {
                    return global.dataFolders
                },
                templateFolders: () => {
                    return global.templateFolders
                },
                serverVersion: () => {
                    return global.serverVersion
                },
            },

*/
