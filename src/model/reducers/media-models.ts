export enum FileTypes {
    VIDEO = 'video',
    IMAGE = 'image',
}

export interface HiddenFileInfo {
    changed: number
    size: number
}
interface File extends HiddenFileInfo {
    name: string
    type: string
}

export interface MediaFile extends File {
    frames: number
    frameTime: string
    frameRate: number
    duration: number
}

export interface ThumbnailFile extends File {
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
