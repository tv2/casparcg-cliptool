import { VideoFormat } from '../video-format'

export enum OperationMode {
    CONTROL = 'control',
    EDIT_VISIBILITY = 'edit_visibility',
}

export interface Settings {
    ccgConfig: CcgConfig
    tabData: TabData[]
    generics: GenericSettings
}

export interface TabData {
    key: number
    title: string
}

export interface CcgConfig {
    channels: CcgConfigChannel[]
    path: string
}

export interface CcgConfigChannel {
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
    operationMode: OperationMode
    selectedFile: string
}

export interface CcgSettings {
    transitionTime: number
    ip: string
    amcpPort: number
    defaultLayer: number
    oscPort: number
}

export interface GenericSettings {
    ccgSettings: CcgSettings
    outputSettings: OutputSettings[]
}
