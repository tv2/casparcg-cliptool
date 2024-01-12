import { VideoFormat } from '../video-format'

export enum OperationMode {
    CONTROL = 'control',
    EDIT_VISIBILITY = 'edit_visibility',
}

export interface SettingsState {
    ccgConfig: CasparcgConfig
    generics: GenericSettings
}

export interface TabInfo {
    index: number
    title: string
}

export interface CasparcgConfig {
    channels: CasparcgConfigChannel[]
    path: string
}

export interface CasparcgConfigChannel {
    _type?: string
    videoMode?: string
    videoFormat?: VideoFormat
    consumers?: any[]
    straightAlphaOutput?: boolean
    channelLayout?: string
}

export interface OutputSettings {
    label: string
    folder: string
    shouldScale: boolean
    scaleX: number
    scaleY: number
    webUrl: string
    loopState: boolean
    mixState: boolean
    manualStartState: boolean
    webState: boolean
    initialLoopState: boolean
    initialMixState: boolean
    initialManualStartState: boolean
    initialWebState: boolean
    operationMode: OperationMode
    selectedFileName: string
    cuedFileName: string
}

export interface CasparcgSettings {
    transitionTime: number
    ip: string
    amcpPort: number
    defaultLayer: number
    oscPort: number
}

export interface GenericSettings {
    ccgSettings: CasparcgSettings
    outputSettings: OutputSettings[]
}
