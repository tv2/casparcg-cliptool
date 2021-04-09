//Node Modules:
import os from 'os' // Used to display (log) network addresses on local machine
import osc from 'osc' //Using OSC fork from PieceMeta/osc.js as it has excluded hardware serialport support and thereby is crossplatform

//Modules:
import { CasparCG } from 'casparcg-connection'
import { reduxState, reduxStore } from '../../model/reducers/store'
import {
    setTallyFileName,
    setTime,
    updateMediaFiles,
    updateThumbFileList,
} from '../../model/reducers/mediaActions'

import { socketServer } from './expressHandler'
import * as IO from '../../model/SocketIoConstants'
import { IThumbFile } from '../../model/reducers/mediaReducer'
import { ITabData } from '../../model/reducers/settingsReducer'
import { setTabData, updateSettings } from '../../model/reducers/settingsAction'

//Setup AMCP Connection:
export const ccgConnection = new CasparCG({
    host: reduxState.settings[0].generic.ccgIp,
    port: reduxState.settings[0].generic.ccgAmcpPort,
    autoConnect: true,
})

const setupOscServer = () => {
    let _this2 = this
    const oscConnection = new osc.UDPPort({
        localAddress: '0.0.0.0',
        localPort: reduxState.settings[0].generic.ccgOscPort,
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
                if (message.address.includes('file/name')) {
                    if (layerIndex === 9) {
                        reduxStore.dispatch(
                            setTallyFileName(
                                channelIndex,
                                message.args[0].split('.')[0]
                            )
                        )
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
                /*
                if (message.address.includes('loop')) {
                    ccgChannel[channelIndex].layer[layerIndex].foreground.loop =
                        message.args[0]
                }
                if (message.address.includes('/paused')) {
                    ccgChannel[channelIndex].layer[
                        layerIndex
                    ].foreground.paused = message.args[0]
                }
                */
            }
        })
        .on('error', (error: any) => {
            console.log('OSC error :', error)
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
                reduxState.settings[0].generic.ccgIp,
                ':',
                reduxState.settings[0].generic.ccgAmcpPort
            )
            console.log('CasparCG Server Version :', response.response.data)
        })
        .catch((error) => {
            console.log('No connection to CasparCG', error)
        })
    ccgConnection.getCasparCGConfig().then((response) => {
        console.log('CasparCG Config :', response)
        reduxStore.dispatch(updateSettings(response.channels))
        let tabData: ITabData[] = response.channels.map(
            (channel: any, index: number) => {
                return {
                    key: String(index),
                    title: 'Output ' + String(index + 1),
                }
            }
        )
        reduxStore.dispatch(setTabData(tabData))
        socketServer.emit(IO.TAB_DATA_UPDATE, reduxState.settings[0].tabData)
    })
    startTimerControlledServices()
}

const startTimerControlledServices = () => {
    //Update of timeleft is set to a default 40ms (same as 25FPS)
    let tallyFilesUpdate: string[] = []
    setInterval(() => {
        reduxState.media[0].time.forEach(
            (time: [number, number], index: number) => {
                socketServer.emit(IO.TIME_UPDATE, index, time)
            }
        )
        reduxState.media[0].tallyFile.forEach(
            (tallyFile: string, index: number) => {
                if (tallyFilesUpdate[index] !== tallyFile) {
                    socketServer.emit(IO.TALLY_UPDATE, index, tallyFile)
                }
            }
        )
        tallyFilesUpdate = [...reduxState.media[0].tallyFile]
    }, 40)

    //Check media files on server:
    let waitingForResponse: boolean = false
    setInterval(() => {
        if (!waitingForResponse) {
            waitingForResponse = true
            socketServer.emit(
                IO.LOOP_STATEUPDATE,
                reduxState.media[0].loopState
            )
            ccgConnection.thumbnailList().then((thumbFile) => {
                let thumbNails: IThumbFile[] = thumbFile.response.data.map(
                    (element: IThumbFile) => {
                        return ccgConnection
                            .thumbnailRetrieve(element.name)
                            .then(
                                (thumb: any): IThumbFile => {
                                    return {
                                        name: element.name,
                                        changed: element.changed,
                                        size: element.size,
                                        type: element.type,
                                        thumbnail: thumb.response.data,
                                    }
                                }
                            )
                    }
                )
                Promise.all(thumbNails).then((thumbNailList: IThumbFile[]) => {
                    reduxStore.dispatch(updateThumbFileList(thumbNailList))
                    socketServer.emit(
                        IO.THUMB_UPDATE,
                        reduxState.media[0].thumbnailList
                    )
                })
            })
            ccgConnection
                .cls()
                .then((payload) => {
                    reduxStore.dispatch(updateMediaFiles(payload.response.data))
                    socketServer.emit(
                        IO.MEDIA_UPDATE,
                        reduxState.media[0].mediaFiles
                    )
                    waitingForResponse = false
                })
                .catch((error) => {
                    console.log('Server not connected :', error)
                })
        }
    }, 3000)
}

export const casparCgClient = () => {
    casparCGconnection()
    setupOscServer()
}
