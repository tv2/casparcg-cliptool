export const SET_NAME = 'setName'
export const SET_CLIP = 'setClip'
export const SET_TIME = 'settime'

export const channelSetName = (
    channel: number,
    layer: number,
    foreground: boolean,
    name: string
) => {
    return {
        type: SET_NAME,
        channel: channel,
        layer: layer,
        foreground: foreground,
        name: name,
    }
}

export const channelSetClip = (
    channel: number,
    layer: number,
    clip: [number, number]
) => {
    return {
        type: SET_CLIP,
        channel: channel,
        layer: layer,
        clip: clip,
    }
}

export const channelSetTime = (
    channel: number,
    layer: number,
    time: [number, number]
) => {
    return {
        type: SET_TIME,
        channel: channel,
        layer: layer,
        time: time,
    }
}
