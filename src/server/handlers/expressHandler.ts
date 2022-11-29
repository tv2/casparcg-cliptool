import { logger } from '../utils/logger'
import { socketIoHandlers } from './socketIOServerHandler'

const express = require('express')
const path = require('path')
const app = express()
export const server = require('http').Server(app)
const SERVER_PORT = 5555
export const socketServer = require('socket.io')(server)

app.use('/', express.static(path.join(__dirname, '../../client')))

server.on('connection', () => {
    app.get('/', (req: any, res: any) => {
        logger.info('Connected Client')
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
