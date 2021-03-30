import { secondsToTimeCode } from '../../client/util/TimeCodeToString'
import { SET_CHANNELS, SET_CLIP, SET_NAME, SET_TIME } from './channelsAction'

export interface ICcgChannel {
    layer: Array<ICcgLayer>
}

export interface ICcgLayer {
    foreground: ICcgProducer
    background: ICcgProducer
}

export interface ICcgProducer {
    file: ICcgFile
    loop?: boolean
    paused?: boolean
    producer?: string
}

export interface ICcgFile {
    clip?: [number, number]
    name?: string
    path?: string
    time?: [number, number]
    stream?: any
}

const defaultChannelsReducerState: Array<ICcgChannel[]> = [[]]

const checkArray = (
    state: ICcgChannel[],
    channel: number,
    layer: number
): ICcgChannel[] => {
    if (!state[channel]) {
        state[channel] = { layer: [] }
    }
    if (!state[channel].layer[layer]) {
        state[channel].layer[layer] = {
            background: { file: {} },
            foreground: { file: {} },
        }
    }
    return state
}

let lastTimeCounter = [0, 0, 0, 0]

export const channels = (
    state: Array<ICcgChannel[]> = defaultChannelsReducerState,
    action
) => {
    let { ...nextState } = state

    switch (action.type) {
        case SET_CHANNELS:
            nextState[0] = action.channels
            return nextState
        case SET_NAME:
            checkArray(nextState[0], action.channel, action.layer)
            if (action.foreground) {
                nextState[0][action.channel].layer[
                    action.layer
                ].foreground.file.name = action.name
            } else {
                nextState[0][action.channel].layer[
                    action.layer
                ].background.file.name = action.name
            }
            return nextState
        case SET_CLIP:
            checkArray(nextState[0], action.channel, action.layer)
            nextState[0][action.channel].layer[
                action.layer
            ].foreground.file.clip = action.clip
            return nextState
        case SET_TIME:
            checkArray(nextState[0], action.channel, action.layer)
            nextState[0][action.channel].layer[
                action.layer
            ].foreground.file.time = action.time
            return nextState
        default:
            return nextState
    }
}
