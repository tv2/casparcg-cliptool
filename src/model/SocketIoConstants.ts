// Server to Clients:
export const TIME_TALLY_UPDATE = 'timeTallyUpdate'
export const MEDIA_UPDATE = 'mediaUpdate'
export const THUMB_UPDATE = 'thumbUpdate'
export const HIDDEN_FILES_UPDATE = 'hiddenUpdate'
export const FOLDERS_UPDATE = 'foldersUpdate'
export const TAB_DATA_UPDATE = 'tabDataUpdate'
export const SETTINGS_UPDATE = 'settingsUpdate'
export const LOOP_STATE_UPDATE = 'loopStateUpdate'
export const OPERATION_MODE_UPDATE = 'OperationModeUpdate'
export const MANUAL_START_STATE_UPDATE = 'manualStartStateUpdate'
export const MIX_STATE_UPDATE = 'mixStateUpdate'
export const WEB_STATE_UPDATE = 'webStateUpdate'

// Get from server:
export const GET_SETTINGS = 'getSettings'

// Client Commands:
export const PGM_PLAY = 'pgmPlay'
export const PGM_LOAD = 'pgmLoad'
export const SET_LOOP_STATE = 'setLoopState'
export const SET_OPERATION_MODE = 'setOperationMode'
export const SET_MANUAL_START_STATE = 'setManualStartState'
export const SET_MIX_STATE = 'setMixState'
export const SET_WEB_STATE = 'setWebState'
export const SET_GENERICS = 'setGenerics'
export const RESTART_SERVER = 'restartServer'
export const TOGGLE_THUMBNAIL_VISIBILITY = 'toggleThumbnailVisibility'

// Payload types:
export interface TimeTallyPayload {
    time: [number, number]
    tally: string
}
