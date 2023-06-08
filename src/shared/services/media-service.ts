import {
    FileInfo,
    FileType,
    Media,
    Output as Output,
    ThumbnailFile,
} from '../models/media-models'

class MediaService {
    public getOutput(media: Media, channelIndex: number): Output {
        return media.outputs[channelIndex]
    }

    public getOutputs(media: Media): Output[] {
        return media.outputs
    }

    public getBase64ThumbnailUrl(
        fileName: string,
        channelIndex: number,
        media: Media
    ): string {
        const output = this.getOutput(media, channelIndex)
        if (!output || !output.thumbnailList) {
            return ''
        }
        const thumbnailFile = output.thumbnailList.find(
            (item: ThumbnailFile) =>
                item.name.toUpperCase() === fileName.toUpperCase()
        )
        return thumbnailFile?.thumbnail ?? ''
    }

    public getSelectedFile(
        cleanFileName: string,
        media: Media,
        channelIndex: number
    ): FileInfo | undefined {
        return media.outputs[channelIndex].mediaFiles.find(
            (mediaFile) => mediaFile.name === cleanFileName
        )
    }

    public isValidFile(file: FileInfo, time: [number, number]): boolean {
        return (
            this.isValidImageFile(file, time) ||
            this.isValidVideoFile(file, time)
        )
    }

    private isValidImageFile(file: FileInfo, time: [number, number]): boolean {
        return file.type === FileType.IMAGE && time[0] === 0 && time[1] === 0
    }

    private isValidVideoFile(file: FileInfo, time: [number, number]): boolean {
        return file.type === FileType.VIDEO && !(time[0] === 0 && time[1] === 0)
    }
}

const mediaService: MediaService = new MediaService()
export default mediaService
