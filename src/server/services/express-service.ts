import { logger } from '../utils/logger'
import { SocketIOServerHandlerService } from './socket-io-server-handler-service'
import { CasparCG } from 'casparcg-connection'
import * as path from 'path'
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
} from '../../shared/socket-io-constants'
import { Server as SocketServer, Socket } from 'socket.io'
import * as express from 'express'
import { Express } from 'express'
import { Server as HttpServer } from 'http'

const SERVER_PORT: number = 5555

export class ExpressService {
    public static readonly instance = new ExpressService()
    private socketIoServerHandlerService!: SocketIOServerHandlerService
    private readonly server: HttpServer
    private readonly socketServer: SocketServer<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        any
    >
    private readonly app: Express

    private constructor() {
        this.app = express.default()
        this.server = new HttpServer(this.app)
        this.socketServer = new SocketServer<
            ClientToServerEvents,
            ServerToClientEvents,
            InterServerEvents
        >(this.server)

        this.app.use('/', express.static(path.join(__dirname, '../../client')))

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

        this.socketServer.on(
            'connection',
            (
                socket: Socket<
                    ClientToServerEvents,
                    ServerToClientEvents,
                    InterServerEvents,
                    any
                >
            ) => {
                logger.info(`Client connected: ${socket.id}`)
                this.socketIoServerHandlerService.setupSocketEvents(socket)
            }
        )
    }

    public getSocketServer(): SocketServer<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        any
    > {
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
