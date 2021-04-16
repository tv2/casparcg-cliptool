import { reduxState } from '../model/reducers/store'
import { app } from './app'
import { socket } from './util/SocketClientHandlers'

console.log('Redux initialized :', reduxState)
console.log('Socket Initialized', socket)

app()
