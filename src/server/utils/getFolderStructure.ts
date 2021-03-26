import FileHound from 'filehound'

export const getFolders = (path: string) => {
    let dirList = _getDirectories(path).map((dir: string) => {
        return { folder: dir.replace(path, '') }
    })
    return dirList
}

function _getDirectories(path: string) {
    return FileHound.create().path(path).directory().findSync()
}
