import { ClientToServerCommand } from '../../../shared/socket-io-constants'
import { state } from '../../../shared/store'

export class SocketPlayService {
    private socket: SocketIOClient.Socket

    constructor(socket: SocketIOClient.Socket) {
        this.socket = socket
    }

    public playFile(outputIndex: number, fileName: string): void {
        if (this.checkIfContainsBannedCharacters(fileName)) {
            alert('Attempted to play file with banned character. Aborting')
            return
        }
        this.socket.emit(ClientToServerCommand.PGM_PLAY, outputIndex, fileName)
    }

    public loadFile(outputIndex: number, fileName: string): void {
        if (this.checkIfContainsBannedCharacters(fileName)) {
            alert('Attempted to load file with banned character. Aborting')
            return
        }
        this.socket.emit(ClientToServerCommand.PGM_LOAD, outputIndex, fileName)
    }

    // Can very likely be done using regex - However I don't have the experience with regex to know how.
    private checkIfContainsBannedCharacters(fileName: string): boolean {
        const bannedCharacters =
            state.settings.generics.ccgSettings.bannedCharacters.toLowerCase()
        const loweredFileName = fileName.toLowerCase()

        for (let i = 0; i < bannedCharacters.length; i++) {
            const character = bannedCharacters.charAt(i)
            if (loweredFileName.includes(character)) {
                return true
            }
        }
        return false
    }
}
