// @ts-ignore
import osc from 'osc' //Using OSC fork from PieceMeta/osc.js as it has excluded hardware serialport support and thereby is crossplatform
import { reduxStore, state } from '../../shared/store'
import { setTime } from '../../shared/actions/media-actions'
import { getChannelNumber } from '../utils/ccg-handler-utils'
import { logger } from '../utils/logger'
import { ReduxSettingsService } from '../../shared/services/redux-settings-service'
import { OsService } from '../../shared/services/os-service'
import { ReduxMediaService } from '../../shared/services/redux-media-service'

const reduxMediaService = new ReduxMediaService()
const reduxSettingsService = new ReduxSettingsService()

//Communication with CasparCG consists of 2 parts:
//1. An AMCP connection for receiving media info and sending commands, which is created in the 'casparcg-handler-service'
//2. An OSC connection for receiving realtime info about the media playing on the outputs

//Setup OSC Connection:
export function ccgOSCServer(): void {
    const oscConnection = new osc.UDPPort({
        localAddress: '0.0.0.0',
        localPort: reduxSettingsService.getGenericSettings(state.settings)
            .ccgSettings.oscPort,
    })

    oscConnection
        .on('ready', () => {
            const osService = new OsService()
            let ipAddresses = osService.getIpAddresses()

            logger.info('Listening for OSC over UDP.')
            ipAddresses.forEach((address) =>
                logger.info(
                    `OSC Host: ${address}:${oscConnection.options.localPort}`
                )
            )
        })
        .on('message', (message: any) => {
            processOscMessage(message)
        })
        .on('error', (error: any) => {
            logger.data(error).error('Error in OSC receive')
        })

    oscConnection.open()
    logger.info(
        `OSC listening on port '${
            reduxSettingsService.getGenericSettings(state.settings).ccgSettings
                .oscPort
        }'.`
    )
}

function processOscMessage(message: any): void {
    let channelIndex = getChannelNumber(message.address) - 1
    if (message.address.includes('/stage/layer')) {
        processOscProducerSegment(message, channelIndex)
        processTimeOscSegment(message, channelIndex)
    }
}

enum MessageSegment {
    TIME = 'file/time',
    PRODUCER = 'foreground/producer',
}

function processOscProducerSegment(message: any, channelIndex: number): void {
    if (message.address.includes(MessageSegment.PRODUCER)) {
        const playingFileType: string = message.args[0]
        if (playingFileType === 'image') {
            setNewTime(channelIndex, [0, 0])
        }
    }
}

function processTimeOscSegment(message: any, channelIndex: number): void {
    if (message.address.includes(MessageSegment.TIME)) {
        const newTime: [number, number] = [
            parseFloat(message.args[0]),
            parseFloat(message.args[1]),
        ]
        if (!(newTime[0] === 0 && newTime[1] === 0)) {
            setNewTime(channelIndex, newTime)
        }
    }
}

function setNewTime(channelIndex: number, newTime: [number, number]): void {
    const output = reduxMediaService.getOutput(state.media, channelIndex)
    if (!output) {
        return
    }
    const oldTime = output.time
    if (newTime[0] !== oldTime[0] || newTime[1] !== oldTime[1]) {
        reduxStore.dispatch(setTime(channelIndex, newTime))
    }
}
