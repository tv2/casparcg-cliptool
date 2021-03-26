//GraphQl:
import { ApolloServer } from 'apollo-server'
import { CCG_GQL_SCHEME } from './graphql/GraphQlScheme'

//Utils:
import './global'
import * as DEFAULTS from './utils/CONSTANTS'

export class CcgGraphQlServer {
    serverOnline: boolean = false
    pubsub: any
    ccgChannel: any

    constructor(pubsub: any, ccgChannel: any) {
        this.pubsub = pubsub
        this.ccgChannel = ccgChannel

        this.setServerOnline = this.setServerOnline.bind(this)
        this.getServerOnline = this.getServerOnline.bind(this)

        this.setupGraphQlServer()
    }

    setupGraphQlServer() {
        // GraphQL resolver
        const resolvers = {
            Subscription: {
                channels: {
                    subscribe: () =>
                        this.pubsub.asyncIterator([
                            DEFAULTS.PUBSUB_CHANNELS_UPDATED,
                        ]),
                },
                playLayer: {
                    subscribe: () =>
                        this.pubsub.asyncIterator([
                            DEFAULTS.PUBSUB_PLAY_LAYER_UPDATED,
                        ]),
                },
                infoChannelUpdated: {
                    subscribe: () =>
                        this.pubsub.asyncIterator([
                            DEFAULTS.PUBSUB_INFO_UPDATED,
                        ]),
                },
                timeLeft: {
                    subscribe: () =>
                        this.pubsub.asyncIterator([
                            DEFAULTS.PUBSUB_TIMELEFT_UPDATED,
                        ]),
                },
                mediaFilesChanged: {
                    subscribe: () =>
                        this.pubsub.asyncIterator([
                            DEFAULTS.PUBSUB_MEDIA_FILE_CHANGED,
                        ]),
                },
            },
            Query: {
                channels: () => {
                    return this.ccgChannel
                },
                layer: (obj: any, args: any, context: any, info: any) => {
                    const ccgLayerString = JSON.stringify(
                        this.ccgChannel[args.ch - 1].layer[args.l - 1]
                    )
                    return ccgLayerString
                },
                timeLeft: (obj: any, args: any, context: any, info: any) => {
                    return (
                        this.ccgChannel[args.ch - 1].layer[args.l - 1]
                            .foreground.length -
                        this.ccgChannel[args.ch - 1].layer[args.l - 1]
                            .foreground.time
                    )
                },
                serverOnline: () => {
                    return this.getServerOnline()
                },
                mediaFolders: () => {
                    return global.mediaFolders
                },
                dataFolders: () => {
                    return global.dataFolders
                },
                templateFolders: () => {
                    return global.templateFolders
                },
                serverVersion: () => {
                    return global.serverVersion
                },
            },
            Channels: {
                layers: (root: any) => root.layer,
            },
            Layers: {
                foreground: (root: any) => root.foreground,
                background: (root: any) => root.background,
            },
            Foreground: {
                name: (root: any) => {
                    return root.name
                },
                path: (root: any) => {
                    return root.path
                },
                length: (root: any) => {
                    return root.length
                },
                loop: (root: any) => {
                    return root.loop
                },
                paused: (root: any) => {
                    return root.paused
                },
            },
            Background: {
                name: (root: any) => {
                    return root.name
                },
                path: (root: any) => {
                    return root.path
                },
                length: (root: any) => {
                    return root.length
                },
                loop: (root: any) => {
                    return root.loop
                },
            },
            Timeleft: {
                timeLeft: (root: any) => {
                    return (
                        root.layer[DEFAULTS.CCG_DEFAULT_LAYER - 1].foreground
                            .length -
                        root.layer[DEFAULTS.CCG_DEFAULT_LAYER - 1].foreground
                            .time
                    )
                },
                time: (root: any) => {
                    return root.layer[DEFAULTS.CCG_DEFAULT_LAYER - 1].foreground
                        .time
                },
            },
        }

        const typeDefs = CCG_GQL_SCHEME
        const server = new ApolloServer({
            typeDefs,
            resolvers,
        })

        server.listen(DEFAULTS.DEFAULT_GRAPHQL_PORT, () =>
            console.log(
                `GraphQl listening on port ${DEFAULTS.DEFAULT_GRAPHQL_PORT}${server.graphqlPath}`
            )
        )
    }

    setServerOnline(state: boolean) {
        this.serverOnline = state
    }
    getServerOnline() {
        return this.serverOnline
    }
}
