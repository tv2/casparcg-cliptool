export enum VideoMode {
    INTERLACED = 'interlaced',
    PROGRESSIVE = 'progressive',
}

export interface VideoResolution {
    width: number
    height: number
}

export interface VideoFormat {
    format: string
    resolution: VideoResolution
    mode: VideoMode
    frameRate: number
}

export function getVideoFormat(text?: string): VideoFormat | undefined {
    const videoModePattern =
        /^((?<formatText>PAL|NTSC)|(?<format>\d+)(?<mode>[ip])(?<frequency>\d+))$/i
    const matchedVideoMode = text?.match(videoModePattern)?.groups
    if (!matchedVideoMode) {
        return
    }
    const format =
        matchedVideoMode.formatText?.toUpperCase() ?? matchedVideoMode.format
    const resolution: VideoResolution = getResolution(format)
    const mode: VideoMode = getMode(format, matchedVideoMode.mode)
    const frequency = getFrequency(format, matchedVideoMode.frequency)
    return {
        format,
        resolution,
        mode,
        frameRate: getFrameRate(mode, frequency),
    }
}

function getResolution(format: string): VideoResolution {
    switch (format) {
        case 'PAL':
            return { width: 720, height: 576 }
        case 'NTSC':
            return { width: 720, height: 486 }
        default:
            const height = parseInt(format, 10)
            return { height, width: (height * 16) / 9 }
    }
}

function getMode(format: string, mode: string): VideoMode {
    switch (format) {
        case 'PAL':
        case 'NTSC':
            return VideoMode.INTERLACED
        default:
            return mode.toLowerCase() === 'i'
                ? VideoMode.INTERLACED
                : VideoMode.PROGRESSIVE
    }
}

function getFrequency(format: string, frequency?: string): number {
    switch (format) {
        case 'PAL':
            return 5000
        case 'NTSC':
            return 5994
        default:
            if (!frequency) {
                throw new Error(
                    `Expected a frequency for the format '${format}'.`
                )
            }
            return parseInt(frequency, 10)
    }
}

function getFrameRate(mode: VideoMode, frequency: number): number {
    const modeFactor = mode === VideoMode.INTERLACED ? 2 : 1
    return frequency / (100 * modeFactor)
}
