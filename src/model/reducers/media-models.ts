export enum FileType {
    VIDEO = 'video',
    IMAGE = 'image',
}

export interface HiddenFileInfo {
    changed: number
    size: number
}
export interface FileInfo extends HiddenFileInfo {
    name: string
    type: string
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
export interface Media {
    outputs: Output[]
    folders: string[]
    hiddenFiles: Record<string, HiddenFileInfo>
}

export interface Output {
    mediaFiles: MediaFile[]
    thumbnailList: ThumbnailFile[]
    time: [number, number]
}
