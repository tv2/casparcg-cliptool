export enum ServerToClientCommand {
    TIME_TALLY_UPDATE = 'time-tally-update',
    MEDIA_UPDATE = 'media-update',
    THUMBNAIL_UPDATE = 'thumbnail-update',
    HIDDEN_FILES_UPDATE = 'hidden-files-update',
    FOLDERS_UPDATE = 'folders-update',
    SETTINGS_UPDATE = 'settings-update',
    LOOP_STATE_UPDATE = 'loop-state-update',
    OPERATION_MODE_UPDATE = 'operation-mode-update',
    MANUAL_START_STATE_UPDATE = 'manual-start-state-update',
    MIX_STATE_UPDATE = 'mix-state-update',
    WEB_STATE_UPDATE = 'web-state-update',
    FILE_CUED_UPDATE = 'file-cued-update',
    FILE_SELECTED_UPDATE = 'file-selected-update',
}

export enum ClientToServerCommand {
    PGM_PLAY = 'pgm-play',
    PGM_LOAD = 'pgm-load',
    SET_LOOP_STATE = 'set-loop-state',
    SET_OPERATION_MODE = 'set-operation-mode',
    SET_MANUAL_START_STATE = 'set-manual-start-state',
    SET_MIX_STATE = 'set-mix-state',
    SET_WEB_STATE = 'set-web-state',
    SET_GENERICS = 'set-generics',
    RESTART_SERVER = 'restart-server',
    TOGGLE_THUMBNAIL_VISIBILITY = 'toggle-thumbnail-visibility',
}

// Get from server:
export const GET_SETTINGS = 'get-settings'

// Payload types:
export interface TimeSelectedFilePayload {
    time: [number, number]
    selectedFileName: string
}
