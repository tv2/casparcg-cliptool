import _ from 'lodash'

export function extractChannelNumber(string: string): number {
    let channel = string.replace('/channel/', '')
    channel = channel.slice(0, channel.indexOf('/'))
    return parseInt(channel)
}

export function extractLayerNumber(address: string): number | false {
    if (!address.includes('/stage/layer')) {
        return false
    }
    return parseInt(address.split('layer/')[1].split('/')[0])
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
