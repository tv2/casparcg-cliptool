import { IMediaFile } from '../../../model/reducers/mediaReducer'
import { IAmpMessage, IChannelStatus } from './Interfaces'

export function readAmpMessage(message: string): IAmpMessage {
    const ampMessage = message.length > 4 ? message.slice(0, 4) : ''
    const ampMessageLength = message.length > 8 ? message.slice(4, 8) : ''
    const ampMessageData = message.length > 8 ? message.slice(8) : ''
    return {
        ampMessageType: ampMessage,
        ampCmdLength: ampMessageLength,
        ampCmdData: ampMessageData,
    }
}

export function hexToAscii(hex: string) {
    let str = ''
    for (let n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16))
    }
    return str
}

export function asciiToHex(str: string) {
    let arr = []
    for (let n = 0, l = str.length; n < l; n++) {
        let hex = ('00' + Number(str.charCodeAt(n)).toString(16)).slice(-2)
        arr.push(hex)
    }
    return arr.join('')
}

export function convertArrayIntoReponseCommand(
    commandType: string,
    arr: string[],
    maxNumberOfItems: number
) {
    let command = ''
    let leftOfArray = [...arr]

    let length = 0
    let numberOfAddedItems = 0
    for (let i = 0; i < arr.length; i++) {
        if (length + arr[i].length + 2 < 256) {
            if (numberOfAddedItems < maxNumberOfItems) {
                leftOfArray.shift()
                numberOfAddedItems++
                length += arr[i].length + 2
            }
        } else {
            i = arr.length
        }
    }

    command += commandType
    // Add 2 for the length of the length and the length of the command
    command += (length + 2).toString(16).padStart(4, '0')
    command += length.toString(16).padStart(4, '0')
    for (let i = 0; i < numberOfAddedItems && i < arr.length; i++) {
        command += arr[i].length.toString(16).padStart(4, '0')
        command += asciiToHex(arr[i])
    }
    return { command, leftOfArray }
}

export function convertTextIntoResponseCommand(
    commandType: string,
    text: string
) {
    let command = ''
    command += commandType
    command += (text.length + 2).toString(16).padStart(4, '0')
    command += text.length.toString(16).padStart(4, '0')
    command += asciiToHex(text)
    return command
}

export function statusSenseResponse(status: IChannelStatus) {
    let response = '7f20'
    response += status.busy ? '82' : '02'
    response += status.playing ? '81' : 'a0'
    response += status.playing ? '80' : '81'
    response += status.automode ? '81' : '01'
    response += '400020000000000000'
    let cueStart = status.cueing ? 'a2' : '62'
    if (status.playing) cueStart = '22'
    response += cueStart
    response += '00'

    response = '7f2002a08181400020000000000000a200'

    return response
    // [0] Rem
    // [1] Stop
    // [2] Still CueDone
    // [3] Auto OutPreset InPreset [9] PresetErr PrevOut PrevIn [svr] CuePla
}

export function filterMediaFilesToAMP(
    mediaFiles: IMediaFile[],
    workingFolder: string
): string[] {
    let ampFileList: string[] = mediaFiles
        .filter((file) => {
            return file.name.startsWith(workingFolder)
        })
        .map((file) => {
            return getFileNameNoPath(file.name)
        })
    return ampFileList
}

export function getFileNameNoPath(fileName: string) {
    return fileName.substring(fileName.lastIndexOf('/') + 1)
}
