declare module NodeJS {
    interface Global {
        mediaFolders: string
        dataFolders: string
        templateFolders: string
        serverVersion: string
        graphQlServer: any
        oscServer: any
    }
}
