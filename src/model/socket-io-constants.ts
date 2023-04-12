export enum ServerToClient {
    TIME_TALLY_UPDATE = 'timeTallyUpdate',
    MEDIA_UPDATE = 'mediaUpdate',
    THUMBNAIL_UPDATE = 'thumbUpdate',
    HIDDEN_FILES_UPDATE = 'hiddenUpdate',
    FOLDERS_UPDATE = 'foldersUpdate',
    SETTINGS_UPDATE = 'settingsUpdate',
    LOOP_STATE_UPDATE = 'loopStateUpdate',
    OPERATION_MODE_UPDATE = 'operationModeUpdate',
    MANUAL_START_STATE_UPDATE = 'manualStartStateUpdate',
    MIX_STATE_UPDATE = 'mixStateUpdate',
    WEB_STATE_UPDATE = 'webStateUpdate',
    FILE_LOADED_UPDATE = 'fileLoadedUpdate',
    FILE_SELECTED_UPDATE = 'fileSelectedUpdate',
}

export enum ClientToServer {
    PGM_PLAY = 'pgmPlay',
    PGM_LOAD = 'pgmLoad',
    SET_LOOP_STATE = 'setLoopState',
    SET_OPERATION_MODE = 'setOperationMode',
    SET_MANUAL_START_STATE = 'setManualStartState',
    SET_MIX_STATE = 'setMixState',
    SET_WEB_STATE = 'setWebState',
    SET_GENERICS = 'setGenerics',
    RESTART_SERVER = 'restartServer',
    TOGGLE_THUMBNAIL_VISIBILITY = 'toggleThumbnailVisibility',
}

// Get from server:
export const GET_SETTINGS = 'getSettings'

// Payload types:
export interface TimeSelectedFilePayload {
    time: [number, number]
    selectedFile: string
}
