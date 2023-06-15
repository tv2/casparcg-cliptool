import * as fs from 'fs'
import * as path from 'path'

export class PersistenceService {
    static readonly instance = new PersistenceService()
    public loadFile(fileName: string): any {
        return fs.readFileSync(path.resolve('storage', fileName))
    }

    public saveFile(
        fileName: string,
        fileContent: string,
        onCompletion: (message: any) => void
    ): void {
        if (!fs.existsSync('storage')) {
            fs.mkdirSync('storage')
        }
        fs.writeFile(
            path.resolve('storage', fileName),
            fileContent,
            'utf8',
            onCompletion
        )
    }
}
