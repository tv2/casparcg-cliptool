export interface ICcgChannel {
    layer: Array<ICcgLayer>
}

export interface ICcgLayer {
    foreground: {
        name: string
        path: string
        time: number
        length: number
        loop: boolean
        paused: boolean
    }
    background: {
        name: string
        path: string
        time: number
        length: number
        loop: boolean
        paused: boolean
    }
}

export interface ICcgChannels extends Array<ICcgChannel> {}

export const generateCcgDataStructure = (
    ccgNumberOfChannels: number,
    ccgNumberOfLayers: number
): ICcgChannels => {
    let ccgChannels: ICcgChannels = []

    // Assign empty values to ccgChannel object
    for (let ch = 0; ch < ccgNumberOfChannels; ch++) {
        ccgChannels.push({ layer: [] })
        for (let l = 0; l < ccgNumberOfLayers; l++) {
            ccgChannels[ch].layer.push({
                foreground: {
                    name: '',
                    path: '',
                    time: 0.0,
                    length: 0.0,
                    loop: false,
                    paused: true,
                },
                background: {
                    name: '',
                    path: '',
                    time: 0,
                    length: 0,
                    loop: false,
                    paused: true,
                },
            })
        }
    }
    return ccgChannels
}
