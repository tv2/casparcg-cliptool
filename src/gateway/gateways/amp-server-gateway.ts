import { createServer, Socket } from 'net'

// import { reduxState } from '../../model/reducers/store'
import { state as reduxState } from '../../shared/store'
import { socket } from '../util/socket-gateway-handlers'

import { ClientToServerCommand } from '../../shared/socket-io-constants'
import { logger } from '../util/logger-gateway'
import { MediaFile } from '../../shared/models/media-models'

import { AmpMessageTypes, AmpReceiveCommandTypes } from './AMP/Constants'
import {
    GetDefaultAmpStatus,
    AmpMessage,
    ChannelStatus,
} from './AMP/Interfaces'
import {
    convertArrayIntoReponseCommand,
    convertTextIntoResponseCommand,
    filterMediaFilesToAMP,
    hexToAscii,
    readAmpMessage,
    statusSenseResponse,
} from './AMP/utils'

let gangStage = ['8f', '8f', '8f', '8f']

let chStatus: ChannelStatus[] = [
    GetDefaultAmpStatus(),
    GetDefaultAmpStatus(),
    GetDefaultAmpStatus(),
    GetDefaultAmpStatus(),
]

export function ampServerGateway() {
    console.log('Initializing AMP server')
    const ampConnection = createServer(ampClientConnection)

    ampConnection.listen(3811)
    logger.info(`AMP Host Listening for TCP on Port: 3811`)

    console.log('Initializing AMP server')
    const appConnection = createServer((socket) => {
        console.log(
            'APP Connection 49171 - Socket created - no usage, just the response',
            socket
        )
    })
    console.log('Initializing APP server' + appConnection.address())

    //    appConnection.listen(49171)
    logger.info(`APP Host Listening for TCP on Port: 49171`)
}

function ampClientConnection(socketClient: Socket) {
    console.log('Client Connected')
    let deliveredFolderArray = [...reduxState.media.folders]

    let deliveredClipList: string[] = []
    // let deliveredClipList = [...clipList]
    let ccgCh = 1
    const writeCache: string[] = []
    const cacheWriter = setInterval(() => {
        const message = writeCache.shift()
        if (message !== undefined) {
            socketClient.write(message)
        }
    }, 0.00001)

    socketClient
        .on('data', (data: any) => {
            let rawMessages = data
                .toString()
                .split('\n')
                .filter((message: any) => message !== '')
            rawMessages.forEach((rawMessage: string) => {
                const ampMessage = readAmpMessage(rawMessage)
                /*
                // Log all commands:
                if (
                    !ampMessage.ampCmdData.includes('610C01') &&
                    !ampMessage.ampCmdData.includes('AA1800') &&
                    !ampMessage.ampCmdData.includes('A012') &&
                    !ampMessage.ampCmdData.includes('61200f')
                ) {
                    console.log(ccgCh, ampMessage.ampCmdData.slice(0, 6))
                }
                */
                switch (ampMessage.ampMessageType) {
                    case AmpMessageTypes.COMMAND:
                        handleAmpCommand(writeCache, ampMessage)
                        break
                    case AmpMessageTypes.CONNECTION:
                        ccgCh =
                            parseInt(ampMessage.ampCmdData.split('Vtr')[1]) || 1
                        chStatus[ccgCh - 1].workingFolder =
                            reduxState.settings.generics.outputsState[ccgCh - 1]
                                .folder || 'default'
                        deliveredClipList = filterMediaFilesToAMP(
                            reduxState.media.outputs[ccgCh - 1]?.mediaFiles ||
                                [],
                            chStatus[ccgCh - 1].workingFolder
                        )
                        console.log('AMP Connection :', rawMessage)
                        writeCache.push('1001')
                        break
                    case AmpMessageTypes.DISCONNECT:
                        console.log(ccgCh, ': Disconnecting AMP Client')
                        socketClient.end()
                        break
                    default:
                        console.log('unknown AMP cmd :', data.toString())
                        break
                }
            })
        })
        .on('error', (error) => {
            console.log('Error : ', error)

            clearInterval(cacheWriter)
        })
        .on('end', () => {
            {
                logger.info('AMP Client disconnected')
            }
            clearInterval(cacheWriter)
        })

    function handleAmpCommand(writeCache: string[], message: AmpMessage) {
        // This 61-type is a workaround until knowlegde of the 6-char commands is gained
        let statusCommandsType61 = false

        switch (message.ampCmdData.slice(0, 6)) {
            case AmpReceiveCommandTypes.STATUS_SENSE_61200F:
                // console.log(ccgCh, ': Status Sense :', message.ampCmdData)
                writeCache.push(statusSenseResponse(chStatus[ccgCh - 1]))
                statusCommandsType61 = true
                break
            case AmpReceiveCommandTypes.STATUS_PLAY_612001:
                console.log(ccgCh, ': 61-type :', message.ampCmdData)
                writeCache.push('712002') //Loading new clip
                statusCommandsType61 = true
                break
            case AmpReceiveCommandTypes.STATUS_CUEING_612003:
                console.log(ccgCh, ': 61-type :', message.ampCmdData)

                if (chStatus[ccgCh - 1].cueing) {
                    // writeCache.push('7320828080') //Still queing
                } else {
                    writeCache.push('732002a081') //Clip queued
                }
                statusCommandsType61 = true
                break
            case AmpReceiveCommandTypes.STATUS_CUE_START_612041:
                // console.log(ccgCh, ': Status QueStart - Reque file')
                writeCache.push('712040')
                statusCommandsType61 = true
                break
            case AmpReceiveCommandTypes.STATUS_TIME_610C01:
                //    console.log(ccgCh, ': 61-type :', ampMessage.ampCommandData)
                writeCache.push('740400000000')
                statusCommandsType61 = true
                break
        }
        if (statusCommandsType61) return

        switch (message.ampCmdData.slice(0, 4)) {
            case AmpReceiveCommandTypes.PLAY_2001:
                console.log(ccgCh, ': Start Play')
                // This is a fake timer to simulate it plays the clip:
                chStatus[ccgCh - 1].playing = true
                setTimeout(() => {
                    chStatus[ccgCh - 1].playing = false
                }, 500)

                socket.emit(ClientToServerCommand.PGM_PLAY, ccgCh - 1)
                writeCache.push('1001')
                break
            case AmpReceiveCommandTypes.STOP_2000:
                console.log(ccgCh, ': STOP')
                socket.emit(ClientToServerCommand.PGM_STOP, ccgCh - 1)
                writeCache.push('1001')
                break
            case AmpReceiveCommandTypes.STOP_FORCE_2031:
                // This doubles as STOP command as GV does not send STOP command
                console.log(ccgCh, ': STOP')
                socket.emit(ClientToServerCommand.PGM_STOP, ccgCh - 1)
                writeCache.push('1001')
                break
            case AmpReceiveCommandTypes.GET_DEVICE_TYPE_0011:
                console.log(ccgCh, ': Get Device Type ')
                writeCache.push('1211d905')
                break
            case AmpReceiveCommandTypes.TIMECODE_MODE_4136:
                console.log(ccgCh, ': Set TimeCode mode', message.ampCmdData)
                writeCache.push('1001')
                break
            case AmpReceiveCommandTypes.GET_FOLDER_LIST_A02B:
                console.log(ccgCh, ': Get folder list')

                if (deliveredFolderArray.length === 0) {
                    // 802b means end of list:
                    writeCache.push('802b')
                    deliveredFolderArray = [...reduxState.media.folders]
                } else {
                    let convertedFolders = convertArrayIntoReponseCommand(
                        '822b',
                        deliveredFolderArray,
                        64
                    )
                    deliveredFolderArray = [...convertedFolders.leftOfArray]
                    writeCache.push(convertedFolders.command)
                }
                break
            case AmpReceiveCommandTypes.GET_MACHINE_ID_A02C:
                console.log(ccgCh, ': Get machine ID', message.ampCmdData)
                writeCache.push('822c000b0a454a3132343830303038')
                break
            case AmpReceiveCommandTypes.SET_WORKING_FOLDER_A20E:
                console.log(
                    ccgCh,
                    ': Set Working folder : ',
                    hexToAscii(message.ampCmdData.slice(12))
                )
                chStatus[ccgCh - 1].workingFolder = hexToAscii(
                    message.ampCmdData.slice(12)
                )
                chStatus[ccgCh - 1].busy = true
                setTimeout(() => {
                    chStatus[ccgCh - 1].busy = false
                }, 300)

                writeCache.push('1001')
                break
            case AmpReceiveCommandTypes.GET_WORKING_FOLDER_A00F:
                console.log(
                    ccgCh,
                    ': A00F Get working folder : ',
                    chStatus[ccgCh - 1].workingFolder
                )

                writeCache.push(
                    convertTextIntoResponseCommand(
                        '820f',
                        chStatus[ccgCh - 1].workingFolder
                    )
                )
                break
            case AmpReceiveCommandTypes.NUMBER_OF_CLIPSA026:
                deliveredClipList = filterMediaFilesToAMP(
                    reduxState.media.outputs[ccgCh - 1]?.mediaFiles || [],
                    chStatus[ccgCh - 1].workingFolder
                )
                // The +1 is for some reason expected by the GV mixer??
                /* const formattedNumberOfClips = (deliveredClipList.length + 1)
                    .toString(16)
                    .padStart(4, '0')
                    */

                //Workaround for now - for some reason
                //the filelist returned to GV is wrong
                const formattedNumberOfClips = (2).toString(16).padStart(4, '0')
                console.log(ccgCh, ' : Num of Clips :' + formattedNumberOfClips)
                deliveredClipList = deliveredClipList.slice(0, 0)
                // End of workaround

                writeCache.push('82260002' + formattedNumberOfClips)
                break
            case AmpReceiveCommandTypes.GET_CLIP_LIST_A115:
                console.log(ccgCh, ': GetClipList :', message.ampCmdData)
                let convertedClipList = convertArrayIntoReponseCommand(
                    '8a14',
                    deliveredClipList,
                    8
                )
                deliveredClipList = [...convertedClipList.leftOfArray]
                writeCache.push(convertedClipList.command)
                if (deliveredClipList.length === 0) {
                    deliveredClipList = filterMediaFilesToAMP(
                        reduxState.media.outputs[ccgCh - 1]?.mediaFiles || [],
                        chStatus[ccgCh - 1].workingFolder
                    )
                }
                break
            case AmpReceiveCommandTypes.GET_FIRST_CLIP_ID_A214:
                const firstClip =
                    reduxState.media.outputs[ccgCh - 1]?.mediaFiles[0]?.name ||
                    'no_clip'

                console.log(ccgCh, ': Get first clip ID :', firstClip)
                writeCache.push(
                    convertTextIntoResponseCommand('8a14', firstClip)
                )
                break
            case AmpReceiveCommandTypes.AUTOMODE_ON_4041:
                console.log(
                    ccgCh,
                    ': Set Automode (used for triggering re-que of already played clip'
                )
                // Using the 4041 command is a workaround for re-triggering a clip that has already been played:
                const fullClipName = (
                    chStatus[ccgCh - 1].workingFolder +
                    '/' +
                    chStatus[ccgCh - 1].loadedClip
                ).toUpperCase()
                reduxState.media.outputs[ccgCh - 1]?.mediaFiles.forEach(
                    (mediaFile: MediaFile) => {
                        if (mediaFile.name === fullClipName) {
                            socket.emit(
                                ClientToServerCommand.PGM_LOAD,
                                ccgCh - 1,
                                fullClipName
                            )
                        }
                    }
                )
                writeCache.push('1001')
                break
            case AmpReceiveCommandTypes.CUE_FILE_AA18:
                let receivedClipName = hexToAscii(message.ampCmdData.slice(12))

                //console.log(ccgCh, ': WorkingFolder :', receivedClipName)
                //console.log(ccgCh, 'Qued file in ClipTool', reduxState.media[0].output[ccgCh - 1]?.tallyFile)

                // AMP protocol returns clipname loaded status, no matter wheter it's loaded or not:
                chStatus[ccgCh - 1].loadedClip = receivedClipName

                const quedFileInClipTool =
                    reduxState.settings.generics.outputsState[
                        ccgCh - 1
                    ]?.cuedFileName.toUpperCase() || ''
                if (
                    !quedFileInClipTool.includes(
                        receivedClipName.toUpperCase() + '.'
                    )
                ) {
                    const newFullClipName = (
                        chStatus[ccgCh - 1].workingFolder +
                        '/' +
                        receivedClipName
                    ).toUpperCase()

                    // this is a fake timeout to simulate the time it takes to load a clip
                    chStatus[ccgCh - 1].cueing = true
                    setTimeout(() => {
                        chStatus[ccgCh - 1].cueing = false
                    }, 500)

                    reduxState.media.outputs[ccgCh - 1]?.mediaFiles.forEach(
                        (mediaFile: MediaFile) => {
                            if (mediaFile.name === newFullClipName) {
                                socket.emit(
                                    ClientToServerCommand.PGM_LOAD,
                                    ccgCh - 1,
                                    newFullClipName
                                )
                            }
                        }
                    )
                }
                if (chStatus[ccgCh - 1].cueing) {
                    writeCache.push('811805') // Cueing file
                    chStatus[ccgCh - 1].cueing = false
                } else {
                    writeCache.push('811807') // File cued
                }
                break
            case AmpReceiveCommandTypes.GET_CLIP_DATA_AA13:
                console.log(ccgCh, ': Get ClipData static for now')
                //Example 8a13002801d95ec198d5fc8001d95ec294f6aa0018420000080902020001000000010000000000000000048e
                writeCache.push(
                    '8a13002801d9459a9a4a970001d9459c535da100120900000809020200010000000100000000000000000102'
                )
                break
            case AmpReceiveCommandTypes.DURATION_REQUEST_A217:
                console.log(ccgCh, ': Get Duration static for now')
                // 841712090000
                writeCache.push('841709150000')
                break
            case AmpReceiveCommandTypes.GET_START_TIME_A225:
                console.log(ccgCh, ': Get Extended transfer ID, static for now')
                writeCache.push('842500000000')
                break
            case AmpReceiveCommandTypes.UNKNOWN_A115:
                console.log(ccgCh, ': A115, response :  8014')
                writeCache.push('8014')
                break
            case AmpReceiveCommandTypes.LOOP_4142:
                chStatus[ccgCh - 1].loop = message.ampCmdData.slice(4) === '01'
                console.log(ccgCh, ': Set Loop :', message.ampCmdData.slice(4))
                // As a workaround loop only set ON state, not OFF:
                if (chStatus[ccgCh - 1].loop) {
                    socket.emit(
                        ClientToServerCommand.SET_LOOP_STATE,
                        ccgCh - 1,
                        chStatus[ccgCh - 1].loop
                    )
                }
                writeCache.push('1001')
                break
            case AmpReceiveCommandTypes.LOOP_OFF_2431:
                // As a workaround use QUE_TO_END as loop state to OFF:
                chStatus[ccgCh - 1].loop = false
                console.log(
                    ccgCh,
                    ': Set Loop to false :',
                    message.ampCmdData.slice(4)
                )
                socket.emit(
                    ClientToServerCommand.SET_LOOP_STATE,
                    ccgCh - 1,
                    chStatus[ccgCh - 1].loop
                )
                writeCache.push('1001')
                break
            case AmpReceiveCommandTypes.ID_CHANGED_LIST_A012:
                // console.log(ccgCh, ': A012, response :  82130000')
                writeCache.push('82130000')
                break
            case AmpReceiveCommandTypes.ID_LOADED_A016:
                console.log(
                    ccgCh,
                    ' : A016, clip: ',
                    chStatus[ccgCh - 1].loadedClip
                )
                writeCache.push(
                    convertTextIntoResponseCommand(
                        '8216',
                        chStatus[ccgCh - 1].loadedClip
                    )
                )

                break
            case AmpReceiveCommandTypes.GET_DEFAULT_FOLDER_A02A:
                console.log(ccgCh, ': Get default folder')
                writeCache.push('822a0009000764656661756c74')
                break
            case AmpReceiveCommandTypes.GET_GANG_INFORMATION_A033:
                console.log(
                    ccgCh,
                    ': Gangstage info :  8133' + gangStage[ccgCh - 1]
                )
                //            writeCache.push('81338f')
                writeCache.push('8133' + gangStage[ccgCh - 1])
                break
            case AmpReceiveCommandTypes.SET_GANG_MASK_A132:
                console.log(
                    ccgCh,
                    ': Set GANG_MASK command received',
                    message.ampCmdData
                )
                gangStage[ccgCh - 1] = message.ampCmdData.slice(4)
                writeCache.push('1001')
                break
            default:
                console.log(ccgCh, ': Unknown : ', message.ampCmdData)
                writeCache.push('1001')
                break
        }
    }
}
