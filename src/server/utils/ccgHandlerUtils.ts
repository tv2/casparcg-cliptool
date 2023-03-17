import _ from 'lodash'
import { ThumbnailFile } from '../../model/reducers/mediaModels'

export function getChannelNumber(string: string): number {
    let channel = string.replace('/channel/', '')
    channel = channel.slice(0, channel.indexOf('/'))
    return parseInt(channel)
}

export function getLayerNumber(string: string): number {
    let channel = string.slice(string.indexOf('layer/') + 6)
    channel = channel.slice(0, channel.indexOf('/'))
    return parseInt(channel)
}

export function extractFoldersList(fileList): string[] {
    let folders: string[] = []
    fileList.forEach((media) => {
        let pathName =
            media.name.substring(0, media.name.lastIndexOf('/')) || ''
        folders.push(pathName)
    })
    return [...new Set(folders)]
}

export function isAlphaFile(filename: string): boolean {
    return /_a(\.[^.]+)?$/i.test(filename)
}

export function isDeepCompareEqual(a: any, b: any): boolean {
    return _.isEqual(a, b)
}

export function isFolderNameEqual(
    fileName: string,
    outputFolder: string
): boolean {
    return (
        outputFolder ===
        fileName
            .substring(0, fileName.lastIndexOf('/'))
            .substring(0, outputFolder.length)
    )
}

export function hasThumbnailListChanged(
    newList: ThumbnailFile[],
    previousList: ThumbnailFile[]
): boolean {
    if (newList.length !== previousList.length) {
        return true
    }

    return newList.some((file, index) => {
        return (
            file.name !== previousList[index].name ||
            file.size !== previousList[index].size
        )
    })
}
