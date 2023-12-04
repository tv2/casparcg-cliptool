export enum FileType {
    VIDEO = 'video',
    IMAGE = 'image',
    UNKNOWN = 'unknown,',
}

export type HiddenFiles = Record<string, HiddenFileInfo>

export interface HiddenFileInfo {
    changed: number
    size: number
}
export interface FileInfo extends HiddenFileInfo {
    name: string
    type: string
    extension: string
}

export interface MediaFile extends FileInfo {
    frames: number
    frameTime: string
    frameRate: number
    duration: number
}

export interface ThumbnailFile extends FileInfo {
    thumbnail: string
}
export interface MediaState {
    outputs: Output[]
    folders: string[]
    hiddenFiles: HiddenFiles
}

export interface Output {
    mediaFiles: MediaFile[]
    thumbnailList: ThumbnailFile[]
    time: [number, number]
}
