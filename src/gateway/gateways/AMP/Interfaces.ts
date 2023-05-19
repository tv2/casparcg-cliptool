export interface IAmpMessage {
    ampMessageType: string
    ampCmdLength: string
    ampCmdData: string
}

export interface IChannelStatus {
    workingFolder: string
    loadedClip: string
    busy: boolean
    automode: boolean
    playing: boolean
    cueStart: boolean
    cueing: boolean
    loop: boolean
}

export const DEFAULT_STATUS: IChannelStatus = {
    loadedClip: 'no_clip',
    workingFolder: 'no_folder',
    busy: false,
    playing: false,
    automode: true,
    cueStart: false,
    cueing: false,
    loop: false,
}
