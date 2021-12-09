//Node Modules:
import os from 'os' // Used to display (log) network addresses on local machine
import osc from 'osc' //Using OSC fork from PieceMeta/osc.js as it has excluded hardware serialport support and thereby is crossplatform

//Modules:
import { CasparCG } from 'casparcg-connection'
import { reduxState, reduxStore } from '../../model/reducers/store'
import {
    setTallyFileName,
    setNumberOfOutputs,
    setTime,
    updateFolderList,
    updateMediaFiles,
    updateThumbFileList,
} from '../../model/reducers/mediaActions'

import { socketServer } from './expressHandler'
import * as IO from '../../model/SocketIoConstants'
import { IOutput, IThumbFile } from '../../model/reducers/mediaReducer'

import { setTabData, updateSettings } from '../../model/reducers/settingsAction'
import { initializeClient } from './socketIOServerHandler'

let waitingForCCGResponse: boolean = false
let previousThumbFiles = []

//Setup AMCP Connection:
export const ccgConnection = new CasparCG({
    host: reduxState.settings[0].generics.ccgIp,
    port: reduxState.settings[0].generics.ccgAmcpPort,
    autoConnect: true,
})

const setupOscServer = () => {
    const oscConnection = new osc.UDPPort({
        localAddress: '0.0.0.0',
        localPort: reduxState.settings[0].generics.ccgOscPort,
    })

    oscConnection
        .on('ready', () => {
            let ipAddresses = getThisMachineIpAddresses()

            console.log('Listening for OSC over UDP.')
            ipAddresses.forEach((address) => {
                console.log(
                    'OSC Host:',
                    address + ', Port:',
                    oscConnection.options.localPort
                )
            })
        })
        .on('message', (message: any) => {
            let channelIndex = findChannelNumber(message.address) - 1
            let layerIndex = findLayerNumber(message.address) - 1
            if (message.address.includes('/stage/layer')) {
                if (message.address.includes('file/path')) {
                    if (layerIndex === 9) {
                        let fileName = message.args[0]
                        if (
                            reduxState.media[0].output[channelIndex]
                                .tallyFile !== fileName
                        ) {
                            reduxStore.dispatch(
                                setTallyFileName(channelIndex, fileName)
                            )
                            reduxStore.dispatch(setTime(channelIndex, [0, 0]))
                        }
                    }
                }
                if (message.address.includes('file/time')) {
                    reduxStore.dispatch(
                        setTime(channelIndex, [
                            parseFloat(message.args[0]),
                            parseFloat(message.args[1]),
                        ])
                    )
                }
            }
        })
        .on('error', (error: any) => {
            console.log('error in OSC receive :', error)
        })

    oscConnection.open()
    console.log(`OSC listening on port 5253`)
}

const getThisMachineIpAddresses = () => {
    let interfaces = os.networkInterfaces()
    let ipAddresses: Array<string> = []
    for (let deviceName in interfaces) {
        let addresses = interfaces[deviceName]
        for (let i = 0; i < addresses.length; i++) {
            let addressInfo = addresses[i]
            if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address)
            }
        }
    }
    return ipAddresses
}

const findChannelNumber = (string: string): number => {
    let channel = string.replace('/channel/', '')
    channel = channel.slice(0, channel.indexOf('/'))
    return parseInt(channel)
}

const findLayerNumber = (string: string): number => {
    let channel = string.slice(string.indexOf('layer/') + 6)
    channel = channel.slice(0, channel.indexOf('/'))
    return parseInt(channel)
}

const casparCGconnection = () => {
    //Check CCG Version and initialise OSC server:
    console.log('Checking CasparCG connection')
    ccgConnection
        .version()
        .then((response) => {
            console.log(
                'AMCP connection established to: ',
                reduxState.settings[0].generics.ccgIp,
                ':',
                reduxState.settings[0].generics.ccgAmcpPort
            )
            console.log('CasparCG Server Version :', response.response.data)
            ccgConnection
                .getCasparCGConfig()
                .then((config) => {
                    console.log('CasparCG Config :', config.channels)
                    reduxStore.dispatch(
                        setNumberOfOutputs(config.channels.length)
                    )
                    reduxStore.dispatch(updateSettings(config.channels))
                    reduxStore.dispatch(setTabData(config.channels.length))
                    console.log('Number of Channels :', config.channels.length)
                    socketServer.emit(
                        IO.SETTINGS_UPDATE,
                        reduxState.settings[0]
                    )
                    waitingForCCGResponse = false
                    initializeClient()
                })
                .catch((error) => {
                    console.log('Error receiving CCG Config', error)
                })
        })
        .catch((error) => {
            console.log('No connection to CasparCG', error)
        })
    startTimerControlledServices()
}

const startTimerControlledServices = () => {
    //Update of timeleft is set to a default 40ms (same as 25FPS)
    let data: IO.ITimeTallyPayload[] = []
    setInterval(() => {
        reduxState.media[0].output.forEach((output: IOutput, index: number) => {
            data[index] = { time: output.time, tally: output.tallyFile }
        })
        socketServer.emit(IO.TIME_TALLY_UPDATE, data)
    }, 40)

    //Check media files on server:
    setInterval(() => {
        if (!waitingForCCGResponse) {
            waitingForCCGResponse = true
            loadCcgMedia().then(() => {
                waitingForCCGResponse = false
            })
        }
    }, 3000)
}

const loadCcgMedia = async () => {
    let thumbFile = await ccgConnection.thumbnailList()

    let thumbNailsUpdated = false
    thumbFile.response.data.forEach((thumb, index: number) => {
        if (previousThumbFiles[index]?.name !== thumb.name) {
            previousThumbFiles = thumbFile.response.data
            thumbNailsUpdated = true
        }
    })
    if (thumbNailsUpdated) {
        let thumbNailList: IThumbFile[] = []
        for (let index = 0; index < thumbFile.response.data.length; index++) {
            let response = await loadThumbNailImage(
                thumbFile.response.data[index]
            )
            thumbNailList.push(response)
        }
        reduxState.media[0].output.forEach(
            (output: IOutput, channelIndex: number) => {
                let outputMedia = thumbNailList.filter(
                    (thumbnail: IThumbFile) => {
                        return thumbnail?.name.includes(
                            reduxState.settings[0].generics.outputFolders[
                                channelIndex
                            ]
                        )
                    }
                )
                if (
                    JSON.stringify(
                        reduxState.media[0].output[channelIndex].thumbnailList
                    ) !== JSON.stringify(outputMedia)
                ) {
                    reduxStore.dispatch(
                        updateThumbFileList(channelIndex, outputMedia)
                    )
                    socketServer.emit(
                        IO.THUMB_UPDATE,
                        channelIndex,
                        reduxState.media[0].output[channelIndex].thumbnailList
                    )
                }
            }
        )
    }

    ccgConnection
        .cls()
        .then((payload) => {
            let folders: string[] = []
            payload.response.data.forEach((media) => {
                let pathName =
                    media.name.substring(0, media.name.lastIndexOf('/')) || ''
                folders.push(pathName)
            })
            folders = [...new Set(folders)]
            reduxStore.dispatch(updateFolderList(folders))
            socketServer.emit(IO.FOLDERS_UPDATE, reduxState.media[0].folderList)

            reduxState.media[0].output.forEach(
                (output: IOutput, channelIndex: number) => {
                    let outputMedia = payload.response.data.filter((file) => {
                        return file.name.includes(
                            reduxState.settings[0].generics.outputFolders[
                                channelIndex
                            ]
                        )
                    })
                    if (
                        JSON.stringify(
                            reduxState.media[0].output[channelIndex].mediaFiles
                        ) !== JSON.stringify(outputMedia)
                    ) {
                        reduxStore.dispatch(
                            updateMediaFiles(channelIndex, outputMedia)
                        )
                        socketServer.emit(
                            IO.MEDIA_UPDATE,
                            channelIndex,
                            reduxState.media[0].output[channelIndex].mediaFiles
                        )
                    }
                }
            )
        })
        .catch((error) => {
            console.log('Error receiving file list :', error)
        })
}

async function loadThumbNailImage(element: IThumbFile) {
    let thumb = await ccgConnection.thumbnailRetrieve(element.name)
    let receivedThumb: IThumbFile = {
        name: element.name,
        changed: element.changed,
        size: element.size,
        type: element.type,
        thumbnail: thumb.response.data,
    }
    return receivedThumb
}

export const casparCgClient = () => {
    casparCGconnection()
    setupOscServer()
}
