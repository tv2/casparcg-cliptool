import {
    GenericSettings,
    OperationMode,
    SettingsState,
} from './models/settings-models'
import { HiddenFiles, MediaFile, ThumbnailFile } from './models/media-models'
import { ErrorEvent } from './models/error-models'

export interface ServerToClientEvents {
    timeTallyUpdate: (timeTallies: TimeSelectedFilePayload[]) => void
    mediaUpdate: (channelIndex: number, mediaFiles: MediaFile[]) => void
    thumbnailUpdate: (
        channelIndex: number,
        thumbnailFiles: ThumbnailFile[]
    ) => void
    hiddenFilesUpdate: (hiddenFiles: HiddenFiles) => void
    folderUpdate: (folders: string[]) => void
    settingsUpdate: (settingsState: SettingsState) => void
    loopStateUpdate: (channelIndex: number, loopState: boolean) => void
    operationModeUpdate: (channelIndex: number, mode: OperationMode) => void
    manualStartStateUpdate: (
        channelIndex: number,
        manualStartState: boolean
    ) => void
    mixStateUpdate: (channelIndex: number, mixState: boolean) => void
    webStateUpdate: (channelIndex: number, webState: boolean) => void
    fileCuedUpdate: (channelIndex: number, fileName: string) => void
    fileSelectedUpdate: (channelIndex: number, fileName: string) => void
    error: (errorEvent: ErrorEvent) => void
}

export interface ClientToServerEvents {
    programPlay: (channelIndex: number, fileName: string) => void
    programLoad: (channelIndex: number, fileName: string) => void
    programStop: (channelIndex: number) => void
    getSettings: () => void
    setLoopState: (channelIndex: number, loopState: boolean) => void
    setOperationMode: (channelIndex: number, mode: OperationMode) => void
    setManualStartState: (
        channelIndex: number,
        manualStartState: boolean
    ) => void
    setMixState: (channelIndex: number, mixState: boolean) => void
    setWebState: (channelIndex: number, webState: boolean) => void
    setGenerics: (generics: GenericSettings) => void
    restartServer: () => void
    toggleThumbnailVisibility: (channelIndex: number, fileName: string) => void
}

export interface InterServerEvents {}

// Todo: Update client's SocketIo when issues regarding Webpack ^5.*.* has been solved.
export enum ServerToClientCommand {
    TIME_TALLY_UPDATE = 'timeTallyUpdate',
    MEDIA_UPDATE = 'mediaUpdate',
    THUMBNAIL_UPDATE = 'thumbnailUpdate',
    HIDDEN_FILES_UPDATE = 'hiddenFilesUpdate',
    FOLDERS_UPDATE = 'folderUpdate',
    SETTINGS_UPDATE = 'settingsUpdate',
    LOOP_STATE_UPDATE = 'loopStateUpdate',
    OPERATION_MODE_UPDATE = 'operationModeUpdate',
    MANUAL_START_STATE_UPDATE = 'manualStartStateUpdate',
    MIX_STATE_UPDATE = 'mixStateUpdate',
    WEB_STATE_UPDATE = 'webStateUpdate',
    FILE_CUED_UPDATE = 'fileCuedUpdate',
    FILE_SELECTED_UPDATE = 'fileSelectedUpdate',
}

export enum ClientToServerCommand {
    PGM_PLAY = 'programPlay',
    PGM_LOAD = 'programLoad',
    PGM_STOP = 'programStop',
    SET_LOOP_STATE = 'setLoopState',
    SET_OPERATION_MODE = 'setOperationMode',
    SET_MANUAL_START_STATE = 'setManualStartState',
    SET_MIX_STATE = 'setMixState',
    SET_WEB_STATE = 'setWebState',
    SET_GENERICS = 'setGenerics',
    RESTART_SERVER = 'restartServer',
    TOGGLE_THUMBNAIL_VISIBILITY = 'toggleThumbnailVisibility',
    GET_SETTINGS = 'getSettings',
}

// Payload types:
export interface TimeSelectedFilePayload {
    time: [number, number]
    selectedFileName: string
}
