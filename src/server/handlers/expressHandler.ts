import { logger } from '../utils/logger'
import { socketIoHandlers } from './socketIOHandler'

const express = require('express')
const path = require('path')
const app = express()
export const server = require('http').Server(app)
const SERVER_PORT = 5555
export const socketServer = require('socket.io')(server)

app.use('/', express.static(path.join(__dirname, '../../client')))

server.on('connection', () => {
    app.get('/', (req: any, res: any) => {
        console.log('Connected Client')
        res.sendFile('index.html')
    })
})

socketServer.on('connection', (socket: any) => {
    logger.info('Client connected :' + String(socket.client.id), {})
    socketIoHandlers(socket)
})

export const serverInit = () => {
    server.listen(SERVER_PORT)
    logger.info(`Server started at http://localhost:${SERVER_PORT}`)
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
