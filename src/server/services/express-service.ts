import { logger } from '../utils/logger'
import { SocketIOServerHandlerService } from './socket-io-server-handler-service'
import { CasparCG } from 'casparcg-connection'
import * as Path from 'path'

const SERVER_PORT = 5555

export class ExpressService {
    public static readonly instance = new ExpressService()
    private socketIoServerHandlerService!: SocketIOServerHandlerService
    private readonly server: any
    private readonly socketServer: any
    private readonly app: any

    private constructor() {
        const express = require('express')
        this.app = express()
        this.server = require('http').Server(this.app)
        this.socketServer = require('socket.io')(this.server)

        this.app.use('/', express.static(Path.join(__dirname, '../../client')))

        this.configureOnEvents()
    }

    public setupExpressService(casparCgConnection: CasparCG): void {
        this.socketIoServerHandlerService = new SocketIOServerHandlerService(
            this.socketServer,
            casparCgConnection
        )
    }

    private configureOnEvents(): void {
        this.server.on('connection', () => {
            this.app.get('/', ({}: any, res: any) => {
                logger.info('Connected Client')
                res.sendFile('index.html')
            })
        })

        this.socketServer.on('connection', (socket: any) => {
            logger.info(`Client connected: ${socket.client.id}`)
            this.socketIoServerHandlerService.setupSocketEvents(socket)
        })
    }

    public getSocketServer(): any {
        return this.socketServer
    }

    public getSocketIoServerHandlerService(): SocketIOServerHandlerService {
        return this.socketIoServerHandlerService
    }

    public serverInit(): void {
        this.server.listen(SERVER_PORT)
        logger.info(`Server started at http://localhost:${SERVER_PORT}`)
    }
}
