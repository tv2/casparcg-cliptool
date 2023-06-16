import * as fs from 'fs'
import * as fsp from 'fs/promises'
import * as path from 'path'

export class PersistenceService {
    static readonly instance = new PersistenceService()
    public async loadFile(fileName: string): Promise<string> {
        return fsp
            .readFile(path.resolve('storage', fileName))
            .then((result) => Promise.resolve(result.toString()))
            .catch((error) => Promise.reject(error))
    }

    public saveFile(fileName: string, fileContent: string): Promise<void> {
        if (!fs.existsSync('storage')) {
            fs.mkdirSync('storage')
        }
        return fsp.writeFile(
            path.resolve('storage', fileName),
            fileContent,
            'utf8'
        )
    }
}
