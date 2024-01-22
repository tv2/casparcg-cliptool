export interface AmpMessage {
    ampMessageType: string
    ampCmdLength: string
    ampCmdData: string
}

export interface ChannelStatus {
    workingFolder: string
    loadedClip: string
    busy: boolean
    automode: boolean
    playing: boolean
    cueStart: boolean
    cueing: boolean
    loop: boolean
}

export const GetDefaultAmpStatus = (): ChannelStatus => {
    return {
        loadedClip: 'no_clip',
        workingFolder: 'no_folder',
        busy: false,
        playing: false,
        automode: true,
        cueStart: false,
        cueing: false,
        loop: false,
    }
}
