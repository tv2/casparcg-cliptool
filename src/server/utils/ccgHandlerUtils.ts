import { IThumbFile } from '../../model/reducers/mediaReducer'
import os from 'os' // Used to display (log) network addresses on local machine

export const getThisMachineIpAddresses = (): string[] => {
    let interfaces = os.networkInterfaces()
    let ipAddresses: string[] = []
    for (let deviceName in interfaces) {
        let addresses = interfaces[deviceName]
        for (const element of addresses) {
            let addressInfo = element
            if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address)
            }
        }
    }
    return ipAddresses
}

export const getChannelNumber = (string: string): number => {
    let channel = string.replace('/channel/', '')
    channel = channel.slice(0, channel.indexOf('/'))
    return parseInt(channel)
}

export const getLayerNumber = (string: string): number => {
    let channel = string.slice(string.indexOf('layer/') + 6)
    channel = channel.slice(0, channel.indexOf('/'))
    return parseInt(channel)
}

export const extractFoldersList = (fileList): string[] => {
    let folders: string[] = []
    fileList.forEach((media) => {
        let pathName =
            media.name.substring(0, media.name.lastIndexOf('/')) || ''
        folders.push(pathName)
    })
    return [...new Set(folders)]
}

export const isAlphaFile = (filename: string): boolean => {
    return /_a(\.[^.]+)?$/i.test(filename)
}

export const isDeepCompareEqual = (a: any, b: any): boolean => {
    return JSON.stringify(a) === JSON.stringify(b)
}

export const isFolderNameEqual = (
    fileName: string,
    outputFolder: string
): boolean => {
    return (
        outputFolder ===
        fileName
            .substring(0, fileName.lastIndexOf('/'))
            .substring(0, outputFolder.length)
    )
}

export const hasThumbListChanged = (
    newList: IThumbFile[],
    previousList: IThumbFile[]
): boolean => {
    if (newList.length !== previousList.length) {
        return true
    } else {
        for (let i = 0; i < newList.length; i++) {
            if (newList[i].name !== previousList[i].name) {
                return true
            }
        }
    }
    return false
}
