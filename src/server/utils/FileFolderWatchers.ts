import chokidar from 'chokidar' //Used to watch filesystem for changes
import * as DEFAULTS from './CONSTANTS'
import { getFolders } from './getFolderStructure'
import '../global'

let mediaFolders
let dataFolders
let templateFolders

//Follow media directories and pubsub if changes occour:
export const mediaFileWatchSetup = (folder: string, pubsub: any) => {
    chokidar
        .watch(folder, { ignored: /(^|[\/\\])\../ })
        .on('all', (event, path) => {
            setTimeout(() => {
                pubsub.publish(DEFAULTS.PUBSUB_MEDIA_FILE_CHANGED, {
                    mediaFilesChanged: true,
                })
                console.log('Media Files Changes :', event, path)
            }, 10)
        })
        .on('ready', () => {
            console.log('Media Files Watch Ready ')
        })
        .on('error', (event: any, path: any) => {
            console.log('Media Files Watch Error:', event, path)
        })
}

//Follow media directories and update mediaFolders if changes occour:
export const mediaFolderWatchSetup = (folder: string) => {
    chokidar
        .watch(folder, { ignored: /(^|[\/\\])\../ })
        .on('all', (event, path) => {
            mediaFolders = getFolders(folder)
        })
        .on('ready', () => {
            console.log('Media Folder "', folder, '" Watch Ready ')
        })
        .on('error', (event: any, path: any) => {
            console.log('Media Folder Watch Error:', event, path)
        })
}

//Follow data directories and update mediaFolders if changes occour:
export const dataFolderWatchSetup = (folder: string) => {
    chokidar
        .watch(folder, { ignored: /(^|[\/\\])\../ })
        .on('all', (event, path) => {
            dataFolders = getFolders(folder)
        })
        .on('ready', () => {
            console.log('Data Folder "', folder, '" Watch Ready ')
        })
        .on('error', (event: any, path: any) => {
            console.log('Data Folder Watch Error:', event, path)
        })
}

//Follow template directories and update mediaFolders if changes occour:
export const templateFolderWatchSetup = (folder: string) => {
    chokidar
        .watch(folder, { ignored: /(^|[\/\\])\../ })
        .on('all', (event, path) => {
            templateFolders = getFolders(folder)
        })
        .on('ready', () => {
            console.log('Template Folder "', folder, '" Watch Ready ')
        })
        .on('error', (event: any, path: any) => {
            console.log('Template Folder Watch Error:', event, path)
        })
}
